import { ApplicationLogProperties, LoggerConfiguration } from '@enigmatis/polaris-logs';
import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { CommonModel, DataVersion } from '../../src';

export const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    url:
        process.env.CONNECTION_STRING ||
        'postgres://dbgazwwm:2ZIUE9vCEh-u-yHNENAhxbgrVJchkg8d@manny.db.elephantsql.com:5432/dbgazwwm',
    entities: [path.resolve(__dirname, '..') + '/dal/*.ts', CommonModel, DataVersion],
    synchronize: true,
    logging: false,
};

export const applicationLogProperties: ApplicationLogProperties = {
    id: 'example',
    name: 'example',
    component: 'repo',
    environment: 'dev',
    version: '1',
};

export const loggerConfig: LoggerConfiguration = {
    loggerLevel: 'debug',
    writeToConsole: true,
    writeFullMessageToConsole: false,
};
