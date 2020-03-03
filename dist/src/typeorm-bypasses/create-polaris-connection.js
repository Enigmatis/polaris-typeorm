"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const __1 = require("..");
const polaris_typeorm_logger_1 = require("../polaris-typeorm-logger");
const polaris_connection_manager_1 = require("./polaris-connection-manager");
async function createPolarisConnection(options, logger, config) {
    options = setPolarisConnectionOptions(options, logger, config);
    return polaris_connection_manager_1.getPolarisConnectionManager()
        .create(options, undefined)
        .connect();
}
exports.createPolarisConnection = createPolarisConnection;
const setPolarisConnectionOptions = (options, logger, config) => {
    Object.assign(options, {
        logger: new polaris_typeorm_logger_1.PolarisTypeormLogger(logger, options.logging),
    });
    if (config) {
        Object.assign(options, { extra: Object.assign(Object.assign({}, options.extra), { config }) });
    }
    const polarisTypeormSubscribers = [
        path.resolve(__dirname, '../') + '/subscribers/*.ts',
        path.resolve(__dirname, '../') + '/subscribers/*.js',
    ];
    Object.assign(options, {
        subscribers: options.subscribers
            ? [...options.subscribers, ...polarisTypeormSubscribers]
            : polarisTypeormSubscribers,
    });
    Object.assign(options, {
        entities: options.entities
            ? [...options.entities, __1.CommonModel, __1.DataVersion]
            : [__1.CommonModel, __1.DataVersion],
    });
    return options;
};
//# sourceMappingURL=create-polaris-connection.js.map