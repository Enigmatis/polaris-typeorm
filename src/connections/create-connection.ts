import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {PolarisEntityManager} from "../polaris-entity-manager";
import {TypeORMConfig} from "../common-polaris";
import {PolarisBaseContext} from "@enigmatis/polaris-common"
import {PolarisGraphQLLogger} from "@enigmatis/polaris-graphql-logger";

export async function createPolarisConnection(options: ConnectionOptions, logger: PolarisGraphQLLogger<PolarisBaseContext>,
                                              config?: TypeORMConfig): Promise<Connection> {
    let connection = await createConnection(options);
    // @ts-ignore
    connection.manager = new PolarisEntityManager(connection, config, logger);
    return connection;
}
