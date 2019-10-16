import {Connection, ConnectionOptions, EntitySchema, Repository} from "typeorm";
import {PolarisConfig, PolarisEntityManager} from "../polaris-entity-manager";

export class PolarisConnection extends Connection {

    constructor(options: ConnectionOptions, polarisConfig: PolarisConfig) {
        super(options);
        // @ts-ignore
        this.manager = new PolarisEntityManager(this, this.createQueryRunner(), polarisConfig);
    }
}