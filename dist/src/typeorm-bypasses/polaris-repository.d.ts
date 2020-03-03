// @ts-nocheck

import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, ObjectID, ObjectLiteral, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
export declare class PolarisRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    /**
     * Saves one or many given entities.
     */
    save<T extends DeepPartial<Entity>>(context: PolarisGraphQLContext, entityOrEntities: T | T[], options?: SaveOptions): Promise<T | T[]>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    update(context: PolarisGraphQLContext, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;
    /**
     * Deletes entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     */
    delete(context: PolarisGraphQLContext, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>): Promise<DeleteResult>;
    /**
     * Counts entities that match given find options or conditions.
     */
    count(context: PolarisGraphQLContext, optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<number>;
    /**
     * Finds entities that match given find options or conditions.
     */
    find(context: PolarisGraphQLContext, optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<Entity[]>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(context: PolarisGraphQLContext, optionsOrConditions?: string | number | Date | ObjectID | FindOneOptions<Entity> | FindConditions<Entity>, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined>;
}
