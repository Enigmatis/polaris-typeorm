import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { EntityManager } from 'typeorm';
export declare class DataVersionHandler {
    private manager;
    constructor(manager: EntityManager);
    updateDataVersion<Entity>(context: PolarisGraphQLContext): Promise<void>;
}
