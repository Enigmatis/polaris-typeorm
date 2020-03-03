"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const polaris_typeorm_logger_1 = require("../../../src/polaris-typeorm-logger");
const polarisGraphQLLogger = { debug: jest.fn() };
const connectionManager = require('../../../src/typeorm-bypasses/polaris-connection-manager');
connectionManager.getPolarisConnectionManager = jest.fn(() => {
    return {
        create: (options) => {
            return {
                connect: () => {
                    return { options };
                },
            };
        },
    };
});
describe('create polaris connection tests', () => {
    it('create connection, send logger and options, expect polaris typeorm logger to be' +
        ' created and defined with the right options', async () => {
        var _a, _b;
        const connection = await src_1.createPolarisConnection({ logging: true }, polarisGraphQLLogger);
        expect(connection.options.logger).toBeDefined();
        expect(connection.options.logger).toBeInstanceOf(polaris_typeorm_logger_1.PolarisTypeormLogger);
        // @ts-ignore
        expect((_a = connection.options.logger) === null || _a === void 0 ? void 0 : _a.options).toBeTruthy();
        // @ts-ignore
        expect((_b = connection.options.logger) === null || _b === void 0 ? void 0 : _b.logger).toEqual(polarisGraphQLLogger);
    });
    it('create connection, send typeorm config, expect connection options to have that config', async () => {
        const connection = await src_1.createPolarisConnection({}, polarisGraphQLLogger, { allowSoftDelete: false });
        expect(connection.options.extra.config.allowSoftDelete).toBeFalsy();
    });
    it('create connection, without typeorm config, expect connection options extra config to be undefined', async () => {
        var _a, _b;
        const connection = await src_1.createPolarisConnection({}, polarisGraphQLLogger);
        expect((_b = (_a = connection.options) === null || _a === void 0 ? void 0 : _a.extra) === null || _b === void 0 ? void 0 : _b.config).toBeUndefined();
    });
    it('create connection, send subscriber in options, expect connection subscribers to contain it', async () => {
        const connection = await src_1.createPolarisConnection({ subscribers: [''] }, polarisGraphQLLogger);
        expect(connection.options.subscribers).toContain('');
    });
    it('create connection, send entity in options, expect connection entities to contain it', async () => {
        const connection = await src_1.createPolarisConnection({ entities: [''] }, polarisGraphQLLogger);
        expect(connection.options.entities).toContain('');
    });
});
//# sourceMappingURL=create-polaris-connection.test.js.map