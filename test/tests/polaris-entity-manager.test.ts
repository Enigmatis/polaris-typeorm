import {expect} from "chai";
import {Book} from "../dal/book";
import {authors, books, initDb, profile, setUpTestConnection, user} from "../utils/set-up";
import {Author} from "../dal/author";
import {User} from "../dal/user";
import {Profile} from "../dal/profile";
import {DataVersion} from "../../src/models/data-version";

const testBookCriteria = {where: {title: books[0].title}};
const testAuthorCriteria = {where: {firstName: authors[0].firstName}};

const bookWithCascadeCriteria = {where: {title: books[1].title}};
const authorWithCascadeCriteria = {where: {firstName: authors[1].firstName}};

const userCriteria = {where: {name: user.name}};
const profileCriteria = {where: {gender: profile.gender}};


describe('entity manager tests', async () => {
    describe('soft delete tests', () => {

        it('delete entity, return deleted entities is true, get entity that is deleted', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            await connection.manager.delete(Book, testBookCriteria);
            let book: Book = await connection.manager.findOne(Book, testBookCriteria);
            expect(book.deleted).to.be.true;
            await connection.close();
        });

        it('delete entity, return deleted entities is true, check that linked entity was not deleted', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            await connection.manager.delete(User, userCriteria);
            let user: User = await connection.manager.findOne(User, {
                where: userCriteria,
                relations: ["profile"]
            });
            expect(user.profile.deleted).to.be.false;
            await connection.close();
        });

        it('delete linked entity, should not return deleted entities(first level), get entity and its linked entity', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            await connection.manager.delete(Profile, profileCriteria);
            let user: User = await connection.manager.findOne(User, {
                where: userCriteria,
                relations: ["profile"]
            });
            expect(user.deleted).to.be.false;
            expect(user.profile.deleted).to.be.true;
            await connection.close();
        });

        it('delete entity, should not return deleted entities, doesnt return deleted entity', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            await connection.manager.delete(Book, testBookCriteria);
            let book: Book = await connection.manager.findOne(Book, testBookCriteria);
            expect(book).to.be.undefined;
            await connection.close();
        });

        it('delete entity, soft delete allow is false and return deleted entities true, doesnt return deleted entity', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true, allow: false}});
            await initDb(connection);
            await connection.manager.delete(Author, testAuthorCriteria);
            let author: Author = await connection.manager.findOne(Author, testAuthorCriteria);
            expect(author).to.be.undefined;
            await connection.close();
        });

        it('delete entity, soft delete allow is false and return deleted entities true and cascade is true,' +
            ' doesnt return deleted entity and its linked entity', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true, allow: false}});
            await initDb(connection);
            await connection.manager.delete(Author, authorWithCascadeCriteria);
            let bookWithCascade: Book = await connection.manager.findOne(Book, bookWithCascadeCriteria);
            let authorWithCascade: Author = await connection.manager.findOne(Author, authorWithCascadeCriteria);
            expect(bookWithCascade).to.be.undefined;
            expect(authorWithCascade).to.be.undefined;
            await connection.close();
        });

        xit('delete entity, soft delete and return deleted entities true and cascade is true,' +
            ' entity and its linked entity are deleted', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            await connection.manager.delete(Author, authorWithCascadeCriteria);
            let bookWithCascade: Book = await connection.manager.findOne(Book, bookWithCascadeCriteria);
            let authorWithCascade: Author = await connection.manager.findOne(Author, authorWithCascadeCriteria);
            expect(bookWithCascade.deleted).to.be.true;
            expect(authorWithCascade.deleted).to.be.true;
            await connection.close();
        });
    });

    describe('data version tests', async () => {
        it('books are created with data version, get all book for data version 0', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            connection.manager.queryRunner.data = {context: {dataVersion: 0}};
            let booksInit: Book[] = await connection.manager.find(Book, {});
            connection.manager.queryRunner.data = {context: {dataVersion: 2}};
            let booksAfterDataVersion: Book[] = await connection.manager.find(Book, {});
            expect(booksInit.length).to.equal(books.length);
            expect(booksAfterDataVersion.length).to.equal(0);
            await connection.close();
        });
        it('fail save action, data version not progressing', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            const bookFail = new Book('fail book');
            connection.manager.queryRunner.data = {context: {realityId: 1}};
            await connection.manager.save(Book, bookFail);
            let dv = await connection.manager.findOne(DataVersion);
            let bookSaved = await connection.manager.findOne(Book, bookFail);
            expect(dv.value).to.equal(1);
            expect(bookSaved).to.equal(undefined);
            await connection.close();
        });
    });

    describe('reality tests', async () => {
        it('reality id is supplied in context', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            const bookReality1 = new Book('Jurassic Park');
            bookReality1.realityId = 1;
            connection.manager.queryRunner.data = {context: {realityId: 1}};
            await connection.manager.save(Book, bookReality1);
            connection.manager.queryRunner.data = {context: {realityId: 1}};
            let book: Book = await connection.manager.findOne(Book, {});
            expect(book).to.deep.equal(bookReality1);
            await connection.close();
        });

        it('delete operational entity, linked oper header true and reality id isnt operational, entity not deleted', async function () {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            connection.manager.queryRunner.data = {context: {realityId: 1}};
            try {
                await connection.manager.delete(Author, testAuthorCriteria);
            } catch (err) {
                expect(err.message).to.equal('there are no entities to delete');
            }
            await connection.close();
        });
    });
    describe('works as expected tests', () => {

        it('find one with id, act as expected', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            const book = new Book('my book');
            await connection.getRepository(Book).save(book);
            let bookFound: Book = await connection.manager.findOne(Book, {where: {id: book.id}});
            expect(book).to.deep.equal(bookFound);
            await connection.close();
        });

        it('save existing entity with different reality id, fail saving', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            const book = new Book('my book');
            await connection.getRepository(Book).save(book);
            book.realityId = 1;
            try {
                await connection.manager.save(Book, book);
            } catch (err) {
                expect(err.message).to.equal('reality id of entity is different from header');
            }
            await connection.close();
        });

        it('count, act as expected', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            expect(await connection.manager.count(Book)).to.equal(books.length);
            await connection.close();
        });

        it('order by', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            let books1 = await connection.manager.find(Book, {
                order: {
                    title: "ASC"
                }
            });
            expect(books1[0].title).to.equal(books[1].title);
            expect(books1[1].title).to.equal(books[0].title);
            await connection.close();
        });
    });
});