"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const polaris_criteria_1 = require("../../../src/contextable-options/polaris-criteria");
const soft_delete_handler_1 = require("../../../src/handlers/soft-delete-handler");
const book_1 = require("../../dal/book");
const library_1 = require("../../dal/library");
let connection;
let metadata;
describe('soft delete handler tests', () => {
    beforeEach(() => {
        metadata = {
            target: library_1.Library,
            inheritanceTree: [library_1.Library],
        };
        metadata.relations = [
            {
                inverseEntityMetadata: {
                    targetName: book_1.Book,
                    foreignKeys: [
                        {
                            referencedEntityMetadata: metadata,
                        },
                    ],
                },
                propertyName: 'books',
            },
        ];
        const execute = jest.fn();
        execute
            .mockResolvedValueOnce({ affected: 1, raw: [{ id: 1 }] })
            .mockResolvedValueOnce({ affected: 0, raw: [] });
        const returningAndExecuteMock = jest.fn(() => {
            return {
                returning: jest.fn(() => {
                    return {
                        execute,
                    };
                }),
            };
        });
        connection = {
            manager: {
                queryRunner: { data: { requestHeaders: {} } },
                save: jest.fn(),
                connection: {
                    getMetadata: jest.fn(() => metadata),
                },
                createQueryBuilder: jest.fn(() => {
                    return {
                        update: jest.fn(() => {
                            return {
                                set: jest.fn(() => {
                                    return {
                                        where: jest.fn(returningAndExecuteMock),
                                        whereInIds: jest.fn(returningAndExecuteMock),
                                    };
                                }),
                            };
                        }),
                    };
                }),
            },
        };
    });
    it('field is not common model, does not delete linked entity', async () => {
        metadata.relations[0].inverseEntityMetadata.inheritanceTree = [];
        metadata.relations[0].inverseEntityMetadata.foreignKeys[0].onDelete = 'CASCADE';
        const softDeleteHandler = new soft_delete_handler_1.SoftDeleteHandler(connection.manager);
        const lib = new library_1.Library('library');
        await softDeleteHandler.softDeleteRecursive(library_1.Library, new polaris_criteria_1.PolarisCriteria(lib, {}));
        expect(connection.manager.createQueryBuilder).toBeCalledTimes(1);
    });
    it('field is common model and cascade is on, delete linked entity', async () => {
        metadata.relations[0].inverseEntityMetadata.inheritanceTree = [book_1.Book, src_1.CommonModel];
        metadata.relations[0].inverseEntityMetadata.foreignKeys[0].onDelete = 'CASCADE';
        const softDeleteHandler = new soft_delete_handler_1.SoftDeleteHandler(connection.manager);
        const lib = new library_1.Library('library');
        await softDeleteHandler.softDeleteRecursive(library_1.Library, new polaris_criteria_1.PolarisCriteria(lib, {}));
        expect(connection.manager.createQueryBuilder).toBeCalledTimes(2);
    });
    it('field is common model but cascade is not on, does not delete linked entity', async () => {
        metadata.relations[0].inverseEntityMetadata.inheritanceTree = [book_1.Book, src_1.CommonModel];
        metadata.relations[0].inverseEntityMetadata.foreignKeys[0].onDelete = '';
        const softDeleteHandler = new soft_delete_handler_1.SoftDeleteHandler(connection.manager);
        const lib = new library_1.Library('library');
        await softDeleteHandler.softDeleteRecursive(library_1.Library, new polaris_criteria_1.PolarisCriteria(lib, {}));
        expect(connection.manager.createQueryBuilder).toBeCalledTimes(1);
    });
});
//# sourceMappingURL=soft-delete-handler.test.js.map