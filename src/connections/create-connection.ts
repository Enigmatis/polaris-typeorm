import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {PolarisConfig, PolarisEntityManager} from "../polaris-entity-manager";

export async function createPolarisConnection(options: ConnectionOptions, polarisConfig: PolarisConfig, polarisLogger: any): Promise<Connection> {
    // create a new connection
    let connection = await createConnection(options);
    // @ts-ignore
    connection.manager = new PolarisEntityManager(connection, polarisConfig, polarisLogger);
    return connection;
}