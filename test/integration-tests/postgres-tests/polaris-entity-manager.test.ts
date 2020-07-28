import { PolarisGraphQLContext } from '@enigmatis/polaris-common';
import { PolarisLogger } from '@enigmatis/polaris-logs';
import { ConnectionOptions } from 'typeorm';
import { createPolarisConnection, PolarisConnection, PolarisRepository } from '../../../src';
import { Book } from '../../dal/book';
import { generateContext } from '../utils/set-up';
import {
    applicationLogProperties,
    connectionOptions,
    loggerConfig,
} from '../utils/test-properties';

let logger: PolarisLogger;
let connection: PolarisConnection;
let testConnection: PolarisConnection;
let bookRepo: PolarisRepository<Book>;
let testBookRepo: PolarisRepository<Book>;
const bookTitle = 'the bible';
let context: PolarisGraphQLContext;
describe('polaris entity manager', () => {
    beforeEach(async () => {
        logger = await new PolarisLogger(loggerConfig, applicationLogProperties);
        connection = await createPolarisConnection(connectionOptions, logger);
        testConnection = await createPolarisConnection(
            {
                ...connectionOptions,
                name: process.env.NEW_SCHEMA,
                schema: process.env.NEW_SCHEMA,
            } as ConnectionOptions,
            logger,
        );
        bookRepo = connection.getRepository(Book);
        testBookRepo = testConnection.getRepository(Book);
        context = generateContext();
        context.reality = { id: 0, name: process.env.SCHEMA_NAME };
    });
    afterEach(async () => {
        await connection.close();
        await testConnection.close();
    });

    describe('schema is changed by reality name in context', () => {
        it('save book on new connection, get it on previous connection', async () => {
            const book = new Book(bookTitle);
            await testBookRepo.save(context, [book]);
            const book2 = await bookRepo.findOne(context, { where: { title: bookTitle } });
            expect(book2).toEqual(book);
        });

        it('update book on new connection, get it on previous connection', async () => {
            const book = new Book(bookTitle);
            await bookRepo.save(context, [book]);
            const newTitle = 'why man love bitches';
            await testBookRepo.update(context, book.getId(), { title: newTitle });
            const bookAfterUpdate = await bookRepo.find(context, {
                where: { id: book.getId() },
            });
            expect(bookAfterUpdate).toHaveLength(1);
            expect(bookAfterUpdate[0].title).toEqual(newTitle);
        });

        it('delete book on new connection, dont get it on previous connection', async () => {
            const book = new Book(bookTitle);
            await bookRepo.save(context, [book]);
            const bookBeforeDelete = await bookRepo.findOne(context, {
                where: { title: bookTitle },
            });
            expect(bookBeforeDelete).toEqual(book);
            await testBookRepo.delete(context, book.getId());
            const bookAfterDelete = await bookRepo.findOne(context, {
                where: { id: book.getId() },
            });
            expect(bookAfterDelete).toBeUndefined();
        });
        it('create book on previous connection, find it on new connection', async () => {
            const book = new Book(bookTitle);
            await bookRepo.save(context, [book]);
            const books = await testBookRepo.find(context, { where: { title: bookTitle } });
            expect(books).toHaveLength(1);
            expect(books[0]).toEqual(book);
        });
        it('create book on previous connection, find one on new connection', async () => {
            const book = new Book(bookTitle);
            await bookRepo.save(context, [book]);
            const bookFromTest = await testBookRepo.findOne(context, {
                where: { title: bookTitle },
            });
            expect(bookFromTest).toEqual(book);
        });
        it('create book on previous connection, count books on new connection', async () => {
            const book = new Book(bookTitle);
            await bookRepo.save(context, [book]);
            const bookFromTest = await testBookRepo.count(context, {
                where: { title: bookTitle },
            });
            expect(bookFromTest).toEqual(1);
        });
    });
});
