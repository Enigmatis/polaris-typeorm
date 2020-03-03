import { FindConditions } from 'typeorm';
import { PolarisFindManyOptions, PolarisFindOneOptions } from '..';
export declare const getEntitiesIncludingDeletedConditions: FindConditions<any>;
export declare class FindHandler {
    findConditions<Entity>(includeLinkedOper: boolean, polarisOptions?: PolarisFindManyOptions<Entity> | PolarisFindOneOptions<Entity>): any;
}
