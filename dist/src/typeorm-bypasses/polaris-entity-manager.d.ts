// @ts-nocheck
import { DeepPartial, DeleteResult, EntityManager, EntitySchema, FindOneOptions, UpdateResult } from 'typeorm';
import { PolarisCriteria, PolarisFindManyOptions, PolarisFindOneOptions, PolarisSaveOptions } from '..';
import { DataVersionHandler } from '../handlers/data-version-handler';
import { FindHandler } from '../handlers/find-handler';
import { SoftDeleteHandler } from '../handlers/soft-delete-handler';
import { PolarisConnection } from './polaris-connection';
import { PolarisRepository } from './polaris-repository';
export declare class PolarisEntityManager extends EntityManager {
    private static setInfoOfCommonModel;
    private static setUpnOfEntity;
    connection: PolarisConnection;
    dataVersionHandler: DataVersionHandler;
    findHandler: FindHandler;
    softDeleteHandler: SoftDeleteHandler;
    protected repositories: Array<PolarisRepository<any>>;
    constructor(connection: PolarisConnection);
    getRepository<Entity>(target: (new () => Entity) | Function | EntitySchema<Entity> | string): PolarisRepository<Entity>;
    delete<Entity>(targetOrEntity: any, criteria: PolarisCriteria | any): Promise<DeleteResult>;
    findOne<Entity>(entityClass: any, criteria: PolarisFindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    find<Entity>(entityClass: any, criteria?: PolarisFindManyOptions<Entity> | any): Promise<Entity[]>;
    count<Entity>(entityClass: any, criteria?: PolarisFindManyOptions<Entity> | any): Promise<number>;
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: any, maybeEntityOrOptions?: PolarisSaveOptions<Entity, T> | any, maybeOptions?: any): Promise<T | T[]>;
    update<Entity>(target: any, criteria: PolarisCriteria | any, partialEntity: any): Promise<UpdateResult>;
    private wrapTransaction;
    private calculateCriteria;
}
