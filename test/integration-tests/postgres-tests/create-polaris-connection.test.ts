import { getPolarisConnectionManager, PolarisConnection } from '../../../src';
import { setUpTestConnection } from '../utils/set-up';

describe('get connection manager tests', () => {
    it('create connection and get it from manager, expect them to be the same one', async () => {
        const connection: PolarisConnection = await setUpTestConnection();
        expect(getPolarisConnectionManager().get()).toEqual(connection);
        await connection.close();
    });
});
