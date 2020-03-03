import { AbstractPolarisLogger } from '@enigmatis/polaris-logs';
import { ConnectionOptions } from 'typeorm';
import { TypeORMConfig } from '../typeorm-config';
import { PolarisConnection } from './polaris-connection';
export declare function createPolarisConnection(options: ConnectionOptions, logger: AbstractPolarisLogger, config?: TypeORMConfig): Promise<PolarisConnection>;
