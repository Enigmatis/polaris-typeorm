import {FindManyOptions, FindOneOptions, ObjectID} from "typeorm";
import {PolarisGraphQLContext} from "@enigmatis/polaris-common";

export class PolarisFindOptions<Entity> {
    criteria: | string
        | string[]
        | number
        | number[]
        | Date
        | Date[]
        | ObjectID
        | ObjectID[]
        | FindOneOptions<Entity>
        | FindManyOptions<Entity>
        | any
    context: PolarisGraphQLContext;

    constructor(criteria: | string
        | string[]
        | number
        | number[]
        | Date
        | Date[]
        | ObjectID
        | ObjectID[]
        | FindOneOptions<Entity>
        | FindManyOptions<Entity>
        | any,
                context: PolarisGraphQLContext) {
        this.criteria = criteria;
        this.context = context;
    }
}