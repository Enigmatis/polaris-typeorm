"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const find_handler_1 = require("../../../src/handlers/find-handler");
const author_1 = require("../../dal/author");
const book_1 = require("../../dal/book");
const library_1 = require("../../dal/library");
const profile_1 = require("../../dal/profile");
const user_1 = require("../../dal/user");
const set_up_1 = require("../utils/set-up");
const bookFindOneOptions = { where: { title: set_up_1.harryPotter } };
const authorFindOneOptions = { where: { name: set_up_1.rowling } };
const bookWithCascadeFindOneOptions = { where: { title: set_up_1.cascadeBook } };
const authorWithCascadeFindOneOptions = { where: { name: set_up_1.mrCascade } };
const userFindOneOptions = { where: { name: set_up_1.userName } };
const profileFindOneOptions = { where: { gender: set_up_1.gender } };
describe('entity manager tests', () => {
    beforeEach(async () => {
        exports.connection = await set_up_1.setUpTestConnection();
        exports.authorRepo = exports.connection.getRepository(author_1.Author);
        exports.bookRepo = exports.connection.getRepository(book_1.Book);
        exports.profileRepo = exports.connection.getRepository(profile_1.Profile);
        exports.userRepo = exports.connection.getRepository(user_1.User);
        exports.dvRepo = exports.connection.getRepository(src_1.DataVersion);
        exports.libraryRepo = exports.connection.getRepository(library_1.Library);
        await set_up_1.initDb();
        set_up_1.setHeaders(exports.connection, { res: { locals: {} } });
    });
    afterEach(async () => {
        await exports.connection.close();
    });
    describe('soft delete tests', () => {
        it('parent is not common model, hard delete parent entity', async () => {
            const findConditions = { name: 'public' };
            const findOptions = { where: findConditions };
            await exports.libraryRepo.delete(set_up_1.generateContext(), findConditions);
            const libAfterDelete = await exports.libraryRepo.findOne(set_up_1.generateContext(), findOptions);
            expect(libAfterDelete).toBeUndefined();
        });
        it('field is not common model, does not delete linked entity', async () => {
            await exports.authorRepo.delete(set_up_1.generateContext(), authorWithCascadeFindOneOptions.where);
            const lib = await exports.libraryRepo.findOne(set_up_1.generateContext(), {
                relations: ['books'],
            });
            const criteria = {
                where: Object.assign(Object.assign({}, authorWithCascadeFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
            };
            const authorWithCascade = await exports.authorRepo.findOne(set_up_1.generateContext(), criteria);
            expect(lib).toBeDefined();
            authorWithCascade
                ? expect(authorWithCascade.getDeleted()).toBeTruthy()
                : expect(authorWithCascade).toBeDefined();
        });
        it('parent and field are common models but cascade is not on, does not delete linked entity', async () => {
            const criteria = {
                where: Object.assign(Object.assign({}, userFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
                relations: ['profile'],
            };
            await exports.userRepo.delete(set_up_1.generateContext(), criteria.where);
            const userCommonModel = await exports.userRepo.findOne(set_up_1.generateContext(), criteria);
            userCommonModel
                ? expect(userCommonModel.getDeleted()).toBeTruthy()
                : expect(userCommonModel).toBeDefined();
            userCommonModel
                ? userCommonModel.profile
                    ? expect(userCommonModel.profile.getDeleted()).toBeFalsy()
                    : expect(userCommonModel.profile).toBeDefined()
                : expect(userCommonModel).toBeDefined();
        });
        it('field is common model and cascade is on, delete linked entity', async () => {
            const authorFindOneOptions1 = {
                where: Object.assign(Object.assign({}, authorWithCascadeFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
                relations: ['books'],
            };
            const bookFindOneOptions1 = {
                where: Object.assign(Object.assign({}, bookWithCascadeFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
            };
            await exports.authorRepo.delete(set_up_1.generateContext(), authorFindOneOptions1.where);
            const authorWithCascade = await exports.authorRepo.findOne(set_up_1.generateContext(), authorFindOneOptions1);
            const bookWithCascade = await exports.bookRepo.findOne(set_up_1.generateContext(), bookFindOneOptions1);
            bookWithCascade
                ? expect(bookWithCascade.getDeleted()).toBeTruthy()
                : expect(bookWithCascade).toBeDefined();
            authorWithCascade
                ? expect(authorWithCascade.getDeleted()).toBeTruthy()
                : expect(bookWithCascade).toBeDefined();
        });
        it('delete linked entity, should not return deleted entities(first level), get entity and its linked entity', async () => {
            await exports.profileRepo.delete(set_up_1.generateContext(), profileFindOneOptions.where);
            const userEntity = await exports.userRepo.findOne(set_up_1.generateContext(), Object.assign(Object.assign({}, userFindOneOptions), { relations: ['profile'] }));
            if (userEntity === null || userEntity === void 0 ? void 0 : userEntity.profile) {
                expect(userEntity.profile.getDeleted()).toBeTruthy();
                expect(userEntity.getDeleted()).toBeFalsy();
            }
            else {
                expect(userEntity).toBeDefined();
            }
        });
        // checks default setting
        it('delete entity, should not return deleted entities, doesnt return deleted entity', async () => {
            await exports.bookRepo.delete(set_up_1.generateContext(), bookFindOneOptions.where);
            const book = await exports.bookRepo.findOne(set_up_1.generateContext(), bookFindOneOptions);
            expect(book).toBeUndefined();
        });
        // checks soft delete allow false
        it('delete entity, soft delete allow is false and return deleted entities true, doesnt return deleted entity', async () => {
            Object.assign(exports.connection.options, {
                extra: { config: { allowSoftDelete: false } },
            });
            await exports.authorRepo.delete(set_up_1.generateContext(), authorFindOneOptions.where);
            const author = await exports.authorRepo.findOne(set_up_1.generateContext(), {
                where: Object.assign(Object.assign({}, authorFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
            });
            expect(author).toBeUndefined();
        });
        // checks soft delete allow false with cascade
        it('delete entity, soft delete allow is false and return deleted entities true and cascade is true,' +
            ' doesnt return deleted entity and its linked entity', async () => {
            Object.assign(exports.connection.options, {
                extra: { config: { allowSoftDelete: false } },
            });
            await exports.authorRepo.delete(set_up_1.generateContext(), authorWithCascadeFindOneOptions.where);
            const bookWithCascade = await exports.bookRepo.findOne(set_up_1.generateContext(), {
                where: Object.assign(Object.assign({}, bookWithCascadeFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
            });
            const authorWithCascade = await exports.authorRepo.findOne(set_up_1.generateContext(), {
                where: Object.assign(Object.assign({}, authorWithCascadeFindOneOptions.where), find_handler_1.getEntitiesIncludingDeletedConditions),
            });
            expect(bookWithCascade).toBeUndefined();
            expect(authorWithCascade).toBeUndefined();
        });
    });
    describe('data version tests', () => {
        it('books are created with data version, get all book for data version 0', async () => {
            const booksInit = await exports.bookRepo.find(set_up_1.generateContext({ dataVersion: 0 }), {});
            const booksAfterDataVersion = await exports.bookRepo.find(set_up_1.generateContext({ dataVersion: 2 }), {});
            expect(booksInit.length).toEqual(2);
            expect(booksAfterDataVersion.length).toEqual(0);
        });
        it.skip('fail save action, data version not progressing', async () => {
            const bookFail = new book_1.Book('fail book');
            await exports.bookRepo.save(set_up_1.generateContext(), bookFail);
            const dv = await exports.dvRepo.findOne(set_up_1.generateContext());
            const bookSaved = await exports.bookRepo.findOne(set_up_1.generateContext({ realityId: 1 }), {
                where: { title: bookFail.title },
            });
            dv ? expect(dv.getValue()).toEqual(1) : expect(dv).toBeUndefined();
            expect(bookSaved).toBeUndefined();
        });
    });
    describe('reality tests', () => {
        it('reality id is supplied in headers', async () => {
            const bookReality1 = new book_1.Book('Jurassic Park');
            bookReality1.realityId = 1;
            await exports.bookRepo.save(set_up_1.generateContext({ realityId: 1 }), bookReality1);
            const book = await exports.bookRepo.findOne(set_up_1.generateContext({ realityId: 1 }), {});
            expect(book).toEqual(bookReality1);
        });
        it('delete operational entity, linked oper header true and reality id isnt operational, entity not deleted', async () => {
            try {
                await exports.authorRepo.delete(set_up_1.generateContext({ realityId: 1 }), authorFindOneOptions.where);
            }
            catch (err) {
                expect(err.message).toEqual('there are no entities to delete');
            }
        });
        it('save existing entity with different reality id, fail saving', async () => {
            const book = new book_1.Book('my book');
            await exports.bookRepo.save(set_up_1.generateContext(), book);
            book.realityId = 1;
            try {
                await exports.bookRepo.save(set_up_1.generateContext({ realityId: 1 }), book);
            }
            catch (err) {
                expect(err.message).toEqual('reality id of entity is different from header');
            }
        });
    });
    it('find one with id', async () => {
        const book = new book_1.Book('my book');
        await exports.bookRepo.save(set_up_1.generateContext(), book);
        const bookFound = await exports.bookRepo.findOne(set_up_1.generateContext(), {
            where: { id: book.getId() },
        });
        expect(book).toEqual(bookFound);
    });
    it('count', async () => {
        expect(await exports.bookRepo.count(set_up_1.generateContext(), {})).toEqual(2);
    });
    it('order by', async () => {
        const books1 = await exports.bookRepo.find(set_up_1.generateContext(), {
            order: {
                title: 'ASC',
            },
        });
        expect(books1[0].title).toEqual(set_up_1.cascadeBook);
        expect(books1[1].title).toEqual(set_up_1.harryPotter);
    });
});
//# sourceMappingURL=polaris-repository.test.js.map