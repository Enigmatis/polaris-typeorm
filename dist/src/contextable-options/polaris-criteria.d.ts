import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
export declare class PolarisCriteria {
    criteria: string | string[] | any;
    context: PolarisGraphQLContext;
    constructor(criteria: string | string[] | any, context: PolarisGraphQLContext);
}
