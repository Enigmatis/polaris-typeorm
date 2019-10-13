import {
    Connection, DeleteResult,
    EntityManager,
    EntitySchema, FindConditions,
    FindManyOptions, FindOneOptions, ObjectID,
    ObjectType, QueryRunner, UpdateResult
} from "typeorm";
import {softDeleteHandler} from "./handlers/soft-delete-handler";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

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
        this.config = config;
    }

    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        // @ts-ignore
        return super.findOne(entityClass, this.addContextConditions(idOrOptionsOrConditions), maybeOptions);
    }

    update<Entity>(target: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return super.update(target, criteria, partialEntity);
    }

    delete<Entity>(targetOrEntity: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        if (this.config && this.config.softDelete && this.config.softDelete.allow == false) {
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
        // @ts-ignore
        return super.find(entityClass, this.addContextConditions(optionsOrConditions));
    }

    addContextConditions<Entity>(optionsOrConditions?: FindConditions<Entity>) {
        let all: FindManyOptions<Entity> | any = optionsOrConditions;
        /*if (polarisContext) {
            if (polarisContext.dataVersion) {
                all.where = {...all.where, dataVersion: MoreThan(polarisContext.dataVersion)};
            }
            if (polarisContext.realityId) {
                all.where = {...all.where, realityId: polarisContext.realityId};
            }
        }*/
        let softDelete = softDeleteHandler(this.config);
        all.where = {...all.where, ...softDelete};
        return all;
    }

}