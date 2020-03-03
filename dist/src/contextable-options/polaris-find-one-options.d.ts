import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { FindOneOptions } from 'typeorm';
export declare class PolarisFindOneOptions<Entity> {
    criteria: string | string[] | FindOneOptions<Entity> | any;
    context: PolarisGraphQLContext;
    constructor(criteria: string | string[] | FindOneOptions<Entity> | any, context: PolarisGraphQLContext);
}
