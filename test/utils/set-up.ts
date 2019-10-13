import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {CommonModel} from "../../src/models/common-model";
import {DataVersion} from "../../src/models/data-version";
import {CommonEntitySubscriber} from "../../src/subscribers/common-entity-subscriber";
import {Book} from "../dal/book";
import {Author} from "../dal/author";
import {createPolarisConnection} from "../../src/connections/create-connection";
import {PolarisConfig} from "../../src/polaris-entity-manager";

const path = require('path');

export const setUpTestConnection = async (polarisConfig?: PolarisConfig) => {

    let connectionOptions: ConnectionOptions = {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Aa123456",
        database: "postgres",
        entities: [
            path.resolve(__dirname, '..') + '/dal/*.ts',
            CommonModel,
            DataVersion
        ],
        subscribers: [
            CommonEntitySubscriber
        ],
        synchronize: true,
        logging: false
    };
    return await createPolarisConnection(connectionOptions, polarisConfig);
};
export const initDb = async (connection: Connection) => {
    const author1 = new Author('J.K', 'Rowling', 1);
    const author2 = new Author('Michael', 'Crichton', 1);
    const book1 = new Book('Harry Potter and the Chamber of Secrets', author1, 1);
    const book2 = new Book('Jurassic Park', author2, 2);
    await connection.dropDatabase();
    await connection.synchronize();
    let bookRepo = await connection.getRepository(Book);
    let authorRepo = await connection.getRepository(Author);
    await authorRepo.save([author1, author2]);
    await bookRepo.save([book1, book2]);
};