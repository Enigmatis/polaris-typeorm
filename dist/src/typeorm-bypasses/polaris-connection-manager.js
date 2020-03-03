"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const AlreadyHasActiveConnectionError_1 = require("typeorm/error/AlreadyHasActiveConnectionError");
const ConnectionNotFoundError_1 = require("typeorm/error/ConnectionNotFoundError");
const polaris_connection_1 = require("./polaris-connection");
const polaris_entity_manager_1 = require("./polaris-entity-manager");
/**
 * ConnectionManager is used to store and manage multiple orm typeorm-bypasses.
 * It also provides useful factory methods to simplify connection creation.
 */
class PolarisConnectionManager extends typeorm_1.ConnectionManager {
    constructor() {
        super(...arguments);
        /**
         * List of typeorm-bypasses registered in this connection manager.
         */
        // @ts-ignore
        this.connections = [];
    }
    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws error if connection with the given name was not found.
     */
    // @ts-ignore
    get(name = 'default') {
        const connection = this.connections.find(con => con.name === name);
        if (!connection) {
            throw new ConnectionNotFoundError_1.ConnectionNotFoundError(name);
        }
        return connection;
    }
    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * Connection won't be established, you'll need to manually call connect method to establish connection.
     */
    // @ts-ignore
    create(options, polarisEntityManager) {
        // check if such connection is already registered
        const existConnection = this.connections.find(con => con.name === (options.name || 'default'));
        if (existConnection) {
            // if connection is registered and its not closed then throw an error
            if (existConnection.isConnected) {
                throw new AlreadyHasActiveConnectionError_1.AlreadyHasActiveConnectionError(options.name || 'default');
            }
            // if its registered but closed then simply remove it from the manager
            this.connections.splice(this.connections.indexOf(existConnection), 1);
        }
        // create a new connection
        const connection = new polaris_connection_1.PolarisConnection(options);
        Object.defineProperty(connection, 'manager', {
            value: polarisEntityManager || new polaris_entity_manager_1.PolarisEntityManager(connection),
        });
        Object.defineProperty(connection.manager, 'connection', {
            value: connection,
        });
        this.connections.push(connection);
        return connection;
    }
}
exports.PolarisConnectionManager = PolarisConnectionManager;
function getPolarisConnectionManager() {
    return typeorm_1.getFromContainer(PolarisConnectionManager);
}
exports.getPolarisConnectionManager = getPolarisConnectionManager;
//# sourceMappingURL=polaris-connection-manager.js.map