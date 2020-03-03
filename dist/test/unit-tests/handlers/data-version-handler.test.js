"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const data_version_handler_1 = require("../../../src/handlers/data-version-handler");
describe('data version handler tests', () => {
    it('data version table empty, global data version in extensions and db created', async () => {
        const connection = {
            manager: {
                connection: {},
                findOne: jest.fn(),
                save: jest.fn(),
            },
            logger: { log: jest.fn() },
        };
        const context = { returnedExtensions: {} };
        Object.assign(connection.manager.connection, connection);
        const dataVersionHandler = new data_version_handler_1.DataVersionHandler(connection.manager);
        await dataVersionHandler.updateDataVersion(context);
        expect(connection.manager.save).toBeCalledWith(src_1.DataVersion, new src_1.DataVersion(1));
        expect(context.returnedExtensions.globalDataVersion).toEqual(1);
    });
    it('no global data version in extensions but exist in db, data version incremented and saved to db and extensions', async () => {
        const connection = {
            manager: {
                connection: {},
                findOne: jest
                    .fn()
                    .mockResolvedValueOnce(new src_1.DataVersion(1))
                    .mockResolvedValueOnce(new src_1.DataVersion(2)),
                save: jest.fn(),
                increment: jest.fn(),
            },
            logger: { log: jest.fn() },
        };
        const context = {
            returnedExtensions: {},
        };
        Object.assign(connection.manager.connection, connection);
        const dataVersionHandler = new data_version_handler_1.DataVersionHandler(connection.manager);
        await dataVersionHandler.updateDataVersion(context);
        expect(connection.manager.increment).toBeCalledWith(src_1.DataVersion, {}, 'value', 1);
        expect(context.returnedExtensions.globalDataVersion).toEqual(2);
    });
    it('global data version in extensions and not in db, throws error', async () => {
        const connection = {
            manager: {
                connection: {},
                findOne: jest.fn(),
                save: jest.fn(),
                increment: jest.fn(),
            },
            logger: { log: jest.fn() },
        };
        const context = { returnedExtensions: { globalDataVersion: 1 } };
        Object.assign(connection.manager.connection, connection);
        const dataVersionHandler = new data_version_handler_1.DataVersionHandler(connection.manager);
        try {
            await dataVersionHandler.updateDataVersion(context);
        }
        catch (e) {
            expect(e.message).toEqual('data version in context even though the data version table is empty');
            expect(context.returnedExtensions.globalDataVersion).toEqual(1);
        }
    });
    it('global data version in extensions but does not equal to data version in db, throws error', async () => {
        const connection = {
            manager: {
                connection: {},
                findOne: jest.fn().mockResolvedValueOnce(new src_1.DataVersion(2)),
                save: jest.fn(),
                increment: jest.fn(),
            },
            logger: { log: jest.fn() },
        };
        const context = { returnedExtensions: { globalDataVersion: 1 } };
        Object.assign(connection.manager.connection, connection);
        const dataVersionHandler = new data_version_handler_1.DataVersionHandler(connection.manager);
        try {
            await dataVersionHandler.updateDataVersion(context);
        }
        catch (err) {
            expect(err.message).toEqual('data version in context does not equal data version in table');
            expect(context.returnedExtensions.globalDataVersion).toEqual(1);
        }
    });
    it('global data version in extensions and equal to data version in db, data version does not increment', async () => {
        const connection = {
            manager: {
                connection: {},
                findOne: jest.fn().mockResolvedValueOnce(new src_1.DataVersion(1)),
                save: jest.fn(),
                increment: jest.fn(),
            },
            logger: { log: jest.fn() },
        };
        const context = { returnedExtensions: { globalDataVersion: 1 } };
        Object.assign(connection.manager.connection, connection);
        const dataVersionHandler = new data_version_handler_1.DataVersionHandler(connection.manager);
        await dataVersionHandler.updateDataVersion(context);
        expect(connection.manager.increment).not.toHaveBeenCalled();
        expect(context.returnedExtensions.globalDataVersion).toEqual(1);
    });
});
//# sourceMappingURL=data-version-handler.test.js.map