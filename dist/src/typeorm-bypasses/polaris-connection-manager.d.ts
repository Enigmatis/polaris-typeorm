// @ts-nocheck
import { ConnectionManager, ConnectionOptions } from 'typeorm';
import { PolarisConnection } from './polaris-connection';
import { PolarisEntityManager } from './polaris-entity-manager';
/**
 * ConnectionManager is used to store and manage multiple orm typeorm-bypasses.
 * It also provides useful factory methods to simplify connection creation.
 */
export declare class PolarisConnectionManager extends ConnectionManager {
    /**
     * List of typeorm-bypasses registered in this connection manager.
     */
    readonly connections: PolarisConnection[];
    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws error if connection with the given name was not found.
     */
    get(name?: string): PolarisConnection;
    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * Connection won't be established, you'll need to manually call connect method to establish connection.
     */
    create(options: ConnectionOptions, polarisEntityManager: PolarisEntityManager): PolarisConnection;
}
export declare function getPolarisConnectionManager(): PolarisConnectionManager;
