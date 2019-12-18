import {DeepPartial} from "typeorm";
import {PolarisGraphQLContext} from "@enigmatis/polaris-common";

export class PolarisSaveOptions<Entity, T extends DeepPartial<Entity>>{
    entities: T | T[];
    context: PolarisGraphQLContext;

    constructor(entities: T | T[], context: PolarisGraphQLContext) {
        this.entities = entities;
        this.context = context;
    }
}