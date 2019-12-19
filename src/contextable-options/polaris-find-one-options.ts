import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { FindOneOptions, ObjectID } from 'typeorm';

export interface PolarisFindOneOptions<Entity> {
    criteria:
        | string
        | string[]
        | number
        | number[]
        | Date
        | Date[]
        | ObjectID
        | ObjectID[]
        | FindOneOptions<Entity>
        | any;
    context: PolarisGraphQLContext;
}
