import {
    Connection, DeepPartial, DeleteResult,
    EntityManager,
    EntitySchema, FindConditions,
    FindManyOptions, FindOneOptions, ObjectID,
    ObjectType, QueryRunner, SaveOptions, UpdateResult
} from "typeorm";
import {softDeleteCriteria} from "./handlers/soft-delete-handler";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {DataVersion} from "./models/data-version";
import {dataVersionCriteria, updateDataVersionInEntity} from "./handlers/data-version-handler";
import {runAndMeasureTime} from "./measure-time";
import {PolarisLogger} from "@enigmatis/polaris-logs";
import {CommonModel} from "./models/common-model";
import {realityIdCriteria, realityIdWithLinkedOperCriteria} from "./handlers/reality-handler";

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

const findConditions = (optionsOrConditions?: any, context?: PolarisContext) => {
    let x = merge(optionsOrConditions, softDeleteCriteria(this.config), realityIdWithLinkedOperCriteria(context), dataVersionCriteria(context));
    return x;
};

export class PolarisEntityManager extends EntityManager {

    config: PolarisConfig;
    logger: any;

    constructor(connection: Connection, config: PolarisConfig, logger: PolarisLogger) {
        super(connection, connection.createQueryRunner());
        this.queryRunner.data = {context: {}};
        this.config = config;
        this.logger = logger;
    }

    //todo: check if same reality
    //todo: throw error if entity is null
    // if the field is common modal or list of common model and cascade all or cascade remove is on soft delete it too and field is not syntethic
    // tru update

    async delete<Entity extends CommonModel>(targetOrEntity: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        let run =await runAndMeasureTime(async () => {
            let entities: Entity[] = await this.find(targetOrEntity, merge(criteria, realityIdCriteria(this.queryRunner.data.context)));
            if (entities.length > 0) {
                for (let entity of entities) {
                    if (this.config && this.config.softDelete && this.config.softDelete.allow == false) {
                        return super.delete(targetOrEntity, criteria);
                    }
                    entity.deleted = true;
                }
                return await this.save(entities);
            } else {
                throw new Error('there are no entities to delete');
            }
        });
        this.logger.debug('finished deleting entity successfully', {elapsedTime: run.time});
        return run.returnValue;
    }

    //todo: measure time and log finished with time
    //todo: check if same reality with liked entity and in data version and not deleted (when configs are not default)
    //todo: make one for findone with id and with spec

    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        // @ts-ignore
        return super.findOne(entityClass, findConditions(idOrOptionsOrConditions), maybeOptions);
    }

    //todo: measure time and log finished with time
    //todo: check if same reality with liked entity and in data version and not deleted (when configs are not default)
    //todo: make one for sort and pageable and a class that has spec with sort and page and without spec
    /**
     * Finds entities that match given find options or conditions.
     */
    async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        let entityClassType: any = entityClass;
        // @ts-ignore
        return super.find(entityClass,
            entityClassType.name == "DataVersion" ? optionsOrConditions : findConditions(optionsOrConditions));
    }

    //todo: count with spec with data version spec with reality spec(without linked) with deleted spec(configs!=def)
    //todo: measure time and log finished with time
    //todo count with example spec
    // @ts-ignore
    count<Entity>(entityClass: string, conditions?: FindConditions<Entity>): Promise<number> {
        return undefined;
    }

    //todo: measure time and log finished with time
    //todo: if findone and in the same reality true, else false
    // @ts-ignore
    hasId(target: Function | string, entity: any): boolean {
        return false;
    }

    //todo: measure time and log finished with time
    //todo: save only if entity has the same reality id or if new
    //todo: make transactional everywhere with updateDataVersionInEntity
    //todo: save and flush
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

    //todo: find all ids including deleted elements for irrelevant entities query select by entitiy only spec is reality


    async update<Entity>(target: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        await updateDataVersionInEntity(this);
        partialEntity = {...partialEntity, ...{dataVersion: this.queryRunner.data.context.globalDataVersion}};
        return super.update(target, criteria, partialEntity);
    }
}