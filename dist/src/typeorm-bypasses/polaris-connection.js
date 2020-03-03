"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple typeorm-bypasses to multiple databases in your application.
 */
class PolarisConnection extends typeorm_1.Connection {
    /**
     * Gets repository for the given entity.
     */
    // @ts-ignore
    getRepository(target) {
        return this.manager.getRepository(target);
    }
}
exports.PolarisConnection = PolarisConnection;
//# sourceMappingURL=polaris-connection.js.map