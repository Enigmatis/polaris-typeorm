import { getPolarisConnectionManager } from '../../../src/typeorm-bypasses/create-connection';
import { PolarisConnection } from '../../../src/typeorm-bypasses/polaris-connection';
import { setUpTestConnection } from '../utils/set-up';

describe('create polaris connection tests', () => {
    it('create connection and get it from manager, expect them to be the same one', async () => {
        const connection: PolarisConnection = await setUpTestConnection();
        expect(getPolarisConnectionManager().get()).toEqual(connection);
        await connection.close();
    });
});
