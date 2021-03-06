import { PolarisConnection, PolarisRepository, SnapshotPage, SnapshotStatus } from '../../../src';
import { setUpTestConnection } from '../utils/set-up';

describe('snapshot page tests', () => {
    let connection: PolarisConnection;
    let snapshotRepo: PolarisRepository<SnapshotPage>;

    beforeEach(async () => {
        connection = await setUpTestConnection();
        snapshotRepo = connection.getRepository(SnapshotPage);
    });

    afterEach(async () => {
        await connection.close();
    });

    test('saving snapshot with data, snapshot is saved with requested data', async () => {
        const data: string = 'foo';
        const snapshotPage: SnapshotPage = new SnapshotPage('c9895be8-f2c1-4a0b-a532-33808257761a');
        snapshotPage.setData(data);
        await snapshotRepo.save({} as any, snapshotPage);
        const page: SnapshotPage | undefined = await snapshotRepo.findOne(
            {} as any,
            snapshotPage.getId(),
        );
        expect(page).toBeDefined();
        expect(page).not.toBeNull();
        expect(page!.getData()).toBe(data);
        expect(page!.getStatus()).toBe(SnapshotStatus.IN_PROGRESS);
    });
});
