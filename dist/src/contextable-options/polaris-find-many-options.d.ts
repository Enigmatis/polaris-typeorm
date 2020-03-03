import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { FindManyOptions } from 'typeorm';
export declare class PolarisFindManyOptions<Entity> {
    criteria: FindManyOptions<Entity> | any;
    context: PolarisGraphQLContext;
    constructor(criteria: FindManyOptions<Entity> | any, context: PolarisGraphQLContext);
}
