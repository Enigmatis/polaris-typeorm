import {
    Connection, DeepPartial, DeleteResult,
    EntityManager,
    EntitySchema, FindConditions,
    FindManyOptions, FindOneOptions, MoreThan, ObjectID,
    ObjectType, QueryRunner, SaveOptions, UpdateResult
} from "typeorm";
import {softDeleteHandler} from "./handlers/soft-delete-handler";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {DataVersion} from "./models/data-version";
import {updateDataVersionInEntity} from "./handlers/data-version-handler";

interface PolarisContext {
    logger?: any;
    dataVersion?: number;
    realityId?: number;
    globalDataVersion?: number;
    irrelevantEntities?: any;
}

export interface PolarisConfig {
    softDelete?: {
        allow?: boolean;
        returnEntities?: boolean;
    }
}

export class PolarisEntityManager extends EntityManager {

    config: PolarisConfig;

    constructor(connection: Connection, queryRunner: QueryRunner, config: PolarisConfig) {
        super(connection, queryRunner);
        this.queryRunner.data = {context: {}};
        this.config = config;
    }

    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        // @ts-ignore
        return super.findOne(entityClass, this.addContextConditions(idOrOptionsOrConditions), maybeOptions);
    }

    async update<Entity>(target: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        await updateDataVersionInEntity(this);
        partialEntity = {...partialEntity, ...{dataVersion: this.queryRunner.data.context.globalDataVersion}};
        return super.update(target, criteria, partialEntity);
    }

    async delete<Entity>(targetOrEntity: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        if (this.config && this.config.softDelete && this.config.softDelete.allow == false) {
            await updateDataVersionInEntity(this);
            return super.delete(targetOrEntity, criteria);
        }
        let partialEntity = {};
        partialEntity = {...partialEntity, ...{deleted: true}};
        return super.update(targetOrEntity, criteria, partialEntity);
    }

    /**
     * Finds entities that match given find options or conditions.
     */
    async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        let entityClassType: any = entityClass;
        // @ts-ignore
        return super.find(entityClass,
            entityClassType.name == "DataVersion" ? optionsOrConditions : this.addContextConditions(optionsOrConditions));
    }

    addContextConditions<Entity>(optionsOrConditions?: FindConditions<Entity>) {
        let all: FindManyOptions<Entity> | any = optionsOrConditions;
        if (this.queryRunner && this.queryRunner.data && this.queryRunner.data.context) {
            let polarisContext: PolarisContext = this.queryRunner.data.context;
            if (polarisContext.dataVersion) {
                all.where = {...all.where, dataVersion: MoreThan(polarisContext.dataVersion)};
            }
            if (polarisContext.realityId) {
                all.where = {...all.where, realityId: polarisContext.realityId};
            }
        }
        let softDelete = softDeleteHandler(this.config);
        all.where = {...all.where, ...softDelete};
        return all;
    }

    async save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: (T | T[]) | ObjectType<Entity> | EntitySchema<Entity> | string, maybeEntityOrOptions?: T | T[], maybeOptions?: SaveOptions): Promise<T | T[]> {
        // @ts-ignore
        if (targetOrEntity.name != "DataVersion") {
            await updateDataVersionInEntity(this);
            let realityId = this.queryRunner.data.context.realityId;
            realityId = realityId ? realityId : 0;
            if (maybeEntityOrOptions instanceof Array) {
                for (let t of maybeEntityOrOptions) {
                    // @ts-ignore
                    t.dataVersion = this.queryRunner.data.context.globalDataVersion;
                    // @ts-ignore
                    t.realityId = realityId;
                }
            } else {
                // @ts-ignore
                maybeEntityOrOptions.dataVersion = this.queryRunner.data.context.globalDataVersion;
                // @ts-ignore
                maybeEntityOrOptions.realityId = realityId;
            }
        }
        // @ts-ignore
        return super.save(targetOrEntity, maybeEntityOrOptions, maybeOptions);
    }
}