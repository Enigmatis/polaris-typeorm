import {expect} from "chai";
import {Book} from "./dal/book";
import {initDb, setUpTestConnection} from "./utils/set-up";
import {Author} from "./dal/author";

const book2Criteria = {title: 'Jurassic Park'};
const author2Criteria = {firstName: 'Michael'};

describe('entity manager tests', async () => {
    describe('soft delete tests', async () => {

        it('delete entity, return deleted entities is true, get entity that is deleted', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            await connection.manager.delete(Book, book2Criteria);
            let book: Book = await connection.manager.findOne(Book, {where: book2Criteria});
            expect(book.deleted).to.be.true;
        });

        it('delete entity, return deleted entities is true, check that linked entity was not deleted', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true}});
            await initDb(connection);
            await connection.manager.delete(Book, book2Criteria);
            let book: Book = await connection.manager.findOne(Book, {
                where: book2Criteria,
                relations: ["author"]
            });
            expect(book.author.deleted).to.be.false;
        });

        it('delete linked entity, should not return deleted entities(first level), get entity and its linked entity', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            await connection.manager.delete(Author, author2Criteria);
            let book: Book = await connection.manager.findOne(Book, {
                where: book2Criteria,
                relations: ["author"]
            });
            expect(book.deleted).to.be.false;
            expect(book.author.deleted).to.be.true;
        });

        it('delete entity, should not return deleted entities, doesnt return deleted entity', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            let bookRepo = await connection.manager.delete(Book, book2Criteria);
            let book: Book = await connection.manager.findOne(Book, {where: book2Criteria});
            expect(book).to.be.undefined;
        });

        it('delete entity, soft delete allow is false and return deleted entities true, doesnt return deleted entity', async () => {
            let connection = await setUpTestConnection({softDelete: {returnEntities: true, allow: false}});
            await initDb(connection);
            let bookRepo = await connection.manager.delete(Book, book2Criteria);
            let book: Book = await connection.manager.findOne(Book, {where: book2Criteria});
            expect(book).to.be.undefined;
        });
    });

    describe('data version tests', async () => {
        it('books are created with data version, get all book for data version 0', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            connection.manager.queryRunner.data = {context: {dataVersion:0}};
            let booksInit: Book[] = await connection.manager.find(Book,{});
            connection.manager.queryRunner.data = {context: {dataVersion:1}};
            let books: Book[] = await connection.manager.find(Book,{});
            expect(booksInit.length).to.equal(2);
            expect(books.length).to.equal(0);
        });
    });

    describe('reality tests', async () => {
        it('reality id is supplied in context, ', async () => {
            let connection = await setUpTestConnection();
            await initDb(connection);
            const bookReality1 = new Book('Jurassic Park', undefined);
            connection.manager.queryRunner.data = {context: {realityId:1}};
            await connection.getRepository(Book).save(bookReality1);
            let books: Book[] = await connection.manager.find(Book,{});
            expect(books[0]).to.deep.equal(bookReality1);
        });
    });
});