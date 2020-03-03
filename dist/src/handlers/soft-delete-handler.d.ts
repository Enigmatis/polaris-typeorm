import { EntityManager, UpdateResult } from 'typeorm';
import { PolarisCriteria } from '../contextable-options/polaris-criteria';
export declare class SoftDeleteHandler {
    private manager;
    constructor(manager: EntityManager);
    softDeleteRecursive(targetOrEntity: any, polarisCriteria: PolarisCriteria): Promise<UpdateResult>;
    private updateWithReturningIds;
}
