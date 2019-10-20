import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {PolarisEntityManager} from "../polaris-entity-manager";
import {PolarisConfig} from "../common-polaris";

export async function createPolarisConnection(options: ConnectionOptions, polarisLogger: any, polarisConfig?: PolarisConfig): Promise<Connection> {
    let connection = await createConnection(options);
    // @ts-ignore
    connection.manager = new PolarisEntityManager(connection, polarisConfig, polarisLogger);
    return connection;
}