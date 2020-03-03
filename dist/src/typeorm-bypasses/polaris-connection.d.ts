// @ts-nocheck
import { Connection, EntitySchema, ObjectType } from 'typeorm';
import { PolarisEntityManager } from './polaris-entity-manager';
import { PolarisRepository } from './polaris-repository';
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple typeorm-bypasses to multiple databases in your application.
 */
export declare class PolarisConnection extends Connection {
    manager: PolarisEntityManager;
    /**
     * Gets repository for the given entity.
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): PolarisRepository<Entity>;
}
