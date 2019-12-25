import { PolarisGraphQLContext } from '@enigmatis/polaris-common';

export class PolarisCriteria {
    public criteria: string | string[] | any;
    public context: PolarisGraphQLContext;

    constructor(criteria: string | string[] | any) {
        this.criteria = criteria;
    }
}
