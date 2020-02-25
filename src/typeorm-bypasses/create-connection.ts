import { PolarisLogger } from '@enigmatis/polaris-logs';
import * as path from 'path';
import { ConnectionOptions, getFromContainer } from 'typeorm';
import { CommonModel, DataVersion } from '..';
import { PolarisTypeormLogger } from '../polaris-typeorm-logger';
import { TypeORMConfig } from '../typeorm-config';
import { PolarisConnection } from './polaris-connection';
import { PolarisConnectionManager } from './polaris-connection-manager';
import { PolarisEntityManager } from './polaris-entity-manager';

export async function createPolarisConnection(
    options: ConnectionOptions,
    logger: PolarisLogger,
    config?: TypeORMConfig,
): Promise<PolarisConnection> {
    options = setPolarisConnectionOptions(options, logger, config);
    return getPolarisConnectionManager()
        .create(options, getFromContainer(PolarisEntityManager))
        .connect();
}
export function getPolarisConnectionManager() {
    return getFromContainer(PolarisConnectionManager);
}
const setPolarisConnectionOptions = (
    options: ConnectionOptions,
    logger: PolarisLogger,
    config?: TypeORMConfig,
): ConnectionOptions => {
    Object.assign(options, { logger: new PolarisTypeormLogger(logger, options.logging) });
    const configObj = { config: config || {} };
    options.extra
        ? Object.assign(options.extra, configObj)
        : Object.assign(options, { extra: configObj });
    Object.assign(options, {
        subscribers: [
            path.resolve(__dirname, '../') + '/subscribers/*.ts',
            path.resolve(__dirname, '../') + '/subscribers/*.js',
            options.subscribers,
        ],
    });
    options.entities
        ? Object.assign(options.entities, [...options.entities, CommonModel, DataVersion])
        : Object.assign(options, { entities: [CommonModel, DataVersion] });
    return options;
};