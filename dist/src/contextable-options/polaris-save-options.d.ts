import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { DeepPartial } from 'typeorm';
export declare class PolarisSaveOptions<Entity, T extends DeepPartial<Entity>> {
    entities: T | T[];
    context: PolarisGraphQLContext;
    constructor(entities: T[] | T, context: PolarisGraphQLContext);
}
