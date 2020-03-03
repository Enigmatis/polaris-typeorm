"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PolarisTypeormLogger {
    constructor(logger, options) {
        this.logger = logger;
        if (options) {
            this.options = options;
        }
    }
    log(level, message, queryRunner) {
        switch (level) {
            case 'log':
                if (this.options === 'all' ||
                    this.options === true ||
                    (this.options instanceof Array && this.options.indexOf('log') !== -1)) {
                    this.logger.debug(message);
                }
                break;
            case 'info':
                if (this.options === 'all' ||
                    this.options === true ||
                    (this.options instanceof Array && this.options.indexOf('info') !== -1)) {
                    this.logger.debug(message);
                }
                break;
            case 'warn':
                if (this.options === 'all' ||
                    this.options === true ||
                    (this.options instanceof Array && this.options.indexOf('warn') !== -1)) {
                    this.logger.warn(message);
                }
                break;
        }
    }
    logMigration(message, queryRunner) {
        this.logger.debug(message);
    }
    logQuery(query, parameters, queryRunner) {
        if (this.options === 'all' ||
            this.options === true ||
            (this.options instanceof Array && this.options.indexOf('query') !== -1)) {
            const sql = query +
                (parameters && parameters.length
                    ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
                    : '');
            this.logger.debug('query' + ': ' + sql);
        }
    }
    logQueryError(error, query, parameters, queryRunner) {
        if (this.options === 'all' ||
            this.options === true ||
            (this.options instanceof Array && this.options.indexOf('error') !== -1)) {
            const sql = query +
                (parameters && parameters.length
                    ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
                    : '');
            this.logger.error(`query failed: ` + sql);
            this.logger.error(`error:` + error);
        }
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        const sql = query +
            (parameters && parameters.length
                ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
                : '');
        this.logger.debug(`query is slow: ` + sql);
        this.logger.debug(`execution time: ` + time);
    }
    logSchemaBuild(message, queryRunner) {
        if (this.options === 'all' ||
            (this.options instanceof Array && this.options.indexOf('schema') !== -1)) {
            this.logger.debug(message);
        }
    }
    stringifyParams(parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch (error) {
            // most probably circular objects in parameters
            return parameters;
        }
    }
}
exports.PolarisTypeormLogger = PolarisTypeormLogger;
//# sourceMappingURL=polaris-typeorm-logger.js.map