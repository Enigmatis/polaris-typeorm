"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.connectionOptions = {
    type: 'postgres',
    url: process.env.CONNECTION_STRING || '',
    entities: [path.resolve(__dirname, '../..') + '/dal/*.ts'],
    synchronize: true,
    logging: true,
};
exports.applicationLogProperties = {
    id: 'example',
    name: 'example',
    component: 'repo',
    environment: 'dev',
    version: '1',
};
exports.loggerConfig = {
    loggerLevel: 'debug',
    writeToConsole: true,
    writeFullMessageToConsole: false,
};
//# sourceMappingURL=test-properties.js.map