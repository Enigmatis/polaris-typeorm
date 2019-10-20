import {ConnectionOptions} from "typeorm";
import {CommonModel} from "../../src/models/common-model";
import {DataVersion} from "../../src/models/data-version";

const path = require('path');

export const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Aa123456",
    database: "postgres",
    entities: [
        path.resolve(__dirname, '..') + '/dal/*.ts',
        CommonModel,
        DataVersion
    ],
    logging: false
};

export const applicationLogProperties = {
    id: 'example',
    name: 'example',
    component: 'repo',
    environment: 'dev',
    version: '1'
};

export const loggerConfig = {
    loggerLevel: 'debug',
    writeToConsole: true,
    writeFullMessageToConsole: false
};
