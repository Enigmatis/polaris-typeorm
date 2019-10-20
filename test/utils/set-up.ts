import {Connection} from "typeorm";
import {Book} from "../dal/book";
import {Author} from "../dal/author";
import {createPolarisConnection} from "../../src/connections/create-connection";
import {PolarisConfig} from "../../src/polaris-entity-manager";
import {Profile} from "../dal/profile";
import {User} from "../dal/user";
import {PolarisGraphQLLogger} from "@enigmatis/polaris-graphql-logger"
import {applicationLogProperties, connectionOptions, loggerConfig} from "./test-properties";

export const setUpTestConnection = async (polarisConfig?: PolarisConfig) => {
    const polarisGraphQLLogger = await new PolarisGraphQLLogger(applicationLogProperties, loggerConfig);
    let connection = await createPolarisConnection(connectionOptions, polarisGraphQLLogger, polarisConfig);
    await connection.dropDatabase();
    await connection.synchronize();
    return connection;
};
export const books = [
    new Book('Harry Potter and the Chamber of Secrets'),
    new Book('Cascade Book')];

export const authors = [
    new Author('J.K', 'Rowling', [books[0]]),
    new Author('Mr', 'Cascade', [books[1]])];

export const profile = new Profile("female");
export const user = new User("chen", profile);

export const initDb = async (connection: Connection) => {
    books[1].author = authors[1];
    let profileRepo = await connection.getRepository(Profile);
    let userRepo = await connection.getRepository(User);
    let bookRepo = await connection.getRepository(Book);
    let authorRepo = await connection.getRepository(Author);
    await profileRepo.save(profile);
    await userRepo.save(user);
    await authorRepo.save(authors);
    await bookRepo.save(books);
};