import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { FindManyOptions} from 'typeorm';

export interface PolarisFindManyOptions<Entity> {
    criteria: FindManyOptions<Entity> | any;
    context: PolarisGraphQLContext;
}
