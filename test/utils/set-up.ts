import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {CommonModel} from "../../src/models/common-model";
import {DataVersion} from "../../src/models/data-version";
import {Book} from "../dal/book";
import {Author} from "../dal/author";
import {createPolarisConnection} from "../../src/connections/create-connection";
import {PolarisConfig} from "../../src/polaris-entity-manager";
import {Profile} from "../dal/profile";
import {User} from "../dal/user";

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
        synchronize: true,
        logging: false
    };
    return await createPolarisConnection(connectionOptions, polarisConfig);
};

export const initDb = async (connection: Connection) => {
    const book1 = new Book('Harry Potter and the Chamber of Secrets');
    const book2 = new Book('Jurassic Park');
    const bookWithCascade = new Book('Cascade Book');
    const author1 = new Author('J.K', 'Rowling', [book1]);
    const author2 = new Author('Michael', 'Crichton', [book2]);
    const authorWithCascade = new Author('Mr', 'Cascade', [bookWithCascade]);
    const profile = new Profile("female");
    const user = new User("chen", profile);
    bookWithCascade.author = authorWithCascade;
    await connection.dropDatabase();
    await connection.synchronize();
    let profileRepo = await connection.getRepository(Profile);
    let userRepo = await connection.getRepository(User);
    let bookRepo = await connection.getRepository(Book);
    let authorRepo = await connection.getRepository(Author);
    await profileRepo.save(profile);
    await userRepo.save(user);
    await authorRepo.save([author1, author2, authorWithCascade]);
    await bookRepo.save([book1, book2, bookWithCascade]);
};