import {Connection, ConnectionManager, ConnectionOptions, getConnectionManager} from "typeorm";
import {PolarisConnection} from "./connection";
import {PolarisConfig} from "../polaris-entity-manager";

export async function createPolarisConnection(options: ConnectionOptions, polarisConfig: PolarisConfig): Promise<Connection> {
    // create a new connection
    const connection: PolarisConnection = new PolarisConnection(options, polarisConfig);
    const connectionManager: ConnectionManager = getConnectionManager();
    connectionManager.connections.push(connection);
    return await connection.connect();
}