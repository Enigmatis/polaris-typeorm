import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { ObjectID } from 'typeorm';
// for update and delete
export interface PolarisCriteria<Entity> {
    criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any;
    context: PolarisGraphQLContext;
}
