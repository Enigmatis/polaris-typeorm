import {
    Connection, DeepPartial, DeleteResult,
    EntityManager,
    EntitySchema, FindConditions,
    FindManyOptions, FindOneOptions, MoreThan, ObjectID,
    ObjectType, SaveOptions, UpdateResult
} from "typeorm";
import {softDeleteCriteria, softDeleteRecursive} from "./handlers/soft-delete-handler";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {DataVersion} from "./models/data-version";
import {dataVersionCriteria, updateDataVersionInEntity} from "./handlers/data-version-handler";
import {runAndMeasureTime} from "./measure-time";
import {CommonModel} from "./models/common-model";
import {realityIdCriteria, realityIdWithLinkedOperCriteria} from "./handlers/reality-handler";
import {PolarisGraphQLLogger} from "@enigmatis/polaris-graphql-logger"

export interface PolarisContext {
    dataVersion?: number;
    realityId?: number;
    globalDataVersion?: number;
    irrelevantEntities?: any;
    includeLinkedOper?: boolean;
}

export interface PolarisConfig {
    softDelete?: {
        allow?: boolean;
        returnEntities?: boolean;
    }
}

const merge = require('deepmerge');


//todo: make transactional everywhere with updateDataVersionInEntity
//todo: find with sort and pageable and a class that has spec with sort and page and without spec
//todo count with example spec
//todo: save and flush
//todo: find all ids including deleted elements for irrelevant entities query select by entitiy only spec is reality

export class PolarisEntityManager extends EntityManager {

    config: PolarisConfig;
    logger: any;

    constructor(connection: Connection, config: PolarisConfig, logger: any) {
        super(connection, connection.createQueryRunner());
        this.queryRunner.data = {context: {}};
        this.config = config;
        this.logger = logger;
    }

    findConditions = (optionsOrConditions?: any) => {
        optionsOrConditions = optionsOrConditions ? optionsOrConditions : {};
        let context = this.queryRunner.data.context;
        let where = {where: {...optionsOrConditions.where, ...dataVersionCriteria(context).where, ...softDeleteCriteria(this.config).where, ...realityIdWithLinkedOperCriteria(context).where}};
        optionsOrConditions.where = where.where;
        return optionsOrConditions;
    };

    //todo: check if throw error logs an error
    async delete<Entity extends CommonModel>(targetOrEntity: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        let run = await runAndMeasureTime(async () => {
            let entities: Entity[] = await this.find(targetOrEntity, merge(criteria, realityIdCriteria(this.queryRunner.data.context)));
            if (entities.length > 0) {
                if (this.config && this.config.softDelete && this.config.softDelete.allow == false) {
                    return await super.delete(targetOrEntity, merge(criteria, realityIdCriteria(this.queryRunner.data.context)));
                }
                return await softDeleteRecursive(targetOrEntity, entities, this);
            } else {
                throw new Error('there are no entities to delete');
            }
        });
        this.logger.debug('finished deleting entity successfully', {elapsedTime: run.time});
        return run.returnValue;
    }

    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        let run = await runAndMeasureTime(async () => {
            // @ts-ignore
            return super.findOne(entityClass, this.findConditions(idOrOptionsOrConditions), maybeOptions);
        });
        this.logger.debug('finished finding entity successfully', {elapsedTime: run.time});
        return run.returnValue;
    }

    async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        let run = await runAndMeasureTime(async () => {
            let entityClassType: any = entityClass;
            // @ts-ignore
            return super.find(entityClass,
                entityClassType.name == "DataVersion" ? optionsOrConditions : this.findConditions(optionsOrConditions));
        });
        this.logger.debug('finished find action successfully', {elapsedTime: run.time});
        return run.returnValue;
    }


    async count<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<number> {
        let run = await runAndMeasureTime(() => {
            optionsOrConditions = optionsOrConditions ? optionsOrConditions : {};
            optionsOrConditions.where = realityIdCriteria(this.queryRunner.data.context);
            // @ts-ignore
            return super.count(entityClass, this.findConditions(optionsOrConditions));
        });
        this.logger.debug('finished count action successfully', {elapsedTime: run.time});
        return run.returnValue;
    }

    async exists<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        let run = await runAndMeasureTime(() => {
            idOrOptionsOrConditions = idOrOptionsOrConditions ? idOrOptionsOrConditions : {};
            idOrOptionsOrConditions.where = realityIdCriteria(this.queryRunner.data.context);
            // @ts-ignore
            return super.count(entityClass, this.findConditions(idOrOptionsOrConditions)) >= 1 ? true : false;
        });
        this.logger.debug('finished exist action successfully', {elapsedTime: run.time});
        return run.returnValue;
    }

    setRealityIdOfEntity<Entity extends CommonModel>(entity: Entity, realityId: number) {
        if (!(entity.realityId && entity.realityId != realityId)) {
            entity.realityId = realityId
        } else {
            throw new Error('reality id of entity is different from header');
        }
    }

    async save<Entity extends CommonModel, T extends DeepPartial<Entity>>(targetOrEntity: (T | T[]) | ObjectType<Entity> | EntitySchema<Entity> | string, maybeEntityOrOptions?: T | T[], maybeOptions?: SaveOptions): Promise<T | T[]> {
        let run = await runAndMeasureTime(async () => {
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
                        this.setRealityIdOfEntity(t, realityId);
                    }
                } else {
                    // @ts-ignore
                    maybeEntityOrOptions.dataVersion = this.queryRunner.data.context.globalDataVersion;
                    // @ts-ignore
                    this.setRealityIdOfEntity(maybeEntityOrOptions, realityId);
                }
            }
            // @ts-ignore
            return super.save(targetOrEntity, maybeEntityOrOptions, maybeOptions);
        });
        this.logger.debug('finished save action successfully', {elapsedTime: run.time});
        return run.returnValue;
    }


    async update<Entity>(target: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        await updateDataVersionInEntity(this);
        partialEntity = {...partialEntity, ...{dataVersion: this.queryRunner.data.context.globalDataVersion}};
        return super.update(target, criteria, partialEntity);
    }
}