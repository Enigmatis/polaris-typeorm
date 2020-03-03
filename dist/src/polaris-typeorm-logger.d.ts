import { AbstractPolarisLogger } from '@enigmatis/polaris-logs';
import { Logger, QueryRunner } from 'typeorm';
export declare class PolarisTypeormLogger implements Logger {
    private logger;
    private readonly options;
    constructor(logger: AbstractPolarisLogger, options?: any);
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any;
    logMigration(message: string, queryRunner?: QueryRunner): any;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
    protected stringifyParams(parameters: any[]): string | any[];
}
