"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polaris_logs_1 = require("@enigmatis/polaris-logs");
const src_1 = require("../../../src");
const test_properties_1 = require("../utils/test-properties");
describe('get connection manager tests', () => {
    it('create connection and get it from manager, expect them to be the same one', async () => {
        const polarisGraphQLLogger = await new polaris_logs_1.PolarisLogger(test_properties_1.loggerConfig, test_properties_1.applicationLogProperties);
        const connection = await src_1.createPolarisConnection(test_properties_1.connectionOptions, polarisGraphQLLogger);
        expect(src_1.getPolarisConnectionManager().get()).toEqual(connection);
        await connection.close();
    });
});
//# sourceMappingURL=create-polaris-connection.test.js.map