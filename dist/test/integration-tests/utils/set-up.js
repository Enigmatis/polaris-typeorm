"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polaris_logs_1 = require("@enigmatis/polaris-logs");
const src_1 = require("../../../src");
const author_1 = require("../../dal/author");
const book_1 = require("../../dal/book");
const library_1 = require("../../dal/library");
const profile_1 = require("../../dal/profile");
const user_1 = require("../../dal/user");
const polaris_repository_test_1 = require("../postgres-tests/polaris-repository.test");
const test_properties_1 = require("./test-properties");
exports.setUpTestConnection = async () => {
    const polarisGraphQLLogger = await new polaris_logs_1.PolarisLogger(test_properties_1.loggerConfig, test_properties_1.applicationLogProperties);
    const connection = await src_1.createPolarisConnection(test_properties_1.connectionOptions, polarisGraphQLLogger);
    const tables = ['user', 'profile', 'book', 'author', 'library', 'dataVersion'];
    for (const table of tables) {
        if (connection.manager) {
            try {
                await connection.manager.getRepository(table).query('DELETE FROM "' + table + '";');
            }
            catch (e) {
                polarisGraphQLLogger.error(e.message);
            }
        }
    }
    return connection;
};
exports.gender = 'female';
exports.userName = 'chen';
exports.rowling = 'J.K Rowling';
exports.mrCascade = 'Mr Cascade';
exports.harryPotter = 'Harry Potter and the Chamber of Secrets';
exports.cascadeBook = 'Cascade Book';
exports.initDb = async () => {
    const context = { requestHeaders: { realityId: 0 } };
    const hpBook = new book_1.Book(exports.harryPotter);
    const cbBook = new book_1.Book(exports.cascadeBook);
    const rowlingAuthor = new author_1.Author(exports.rowling, [hpBook]);
    const cascadeAuthor = new author_1.Author(exports.mrCascade, [cbBook]);
    cbBook.author = cascadeAuthor;
    const profile = new profile_1.Profile(exports.gender);
    await polaris_repository_test_1.profileRepo.save(context, profile);
    await polaris_repository_test_1.userRepo.save(context, new user_1.User(exports.userName, profile));
    await polaris_repository_test_1.authorRepo.save(context, [rowlingAuthor, cascadeAuthor]);
    await polaris_repository_test_1.bookRepo.save(context, [hpBook, cbBook]);
    await polaris_repository_test_1.libraryRepo.save(context, new library_1.Library('public', [cbBook]));
};
function setHeaders(connection, headers) {
    var _a, _b;
    if ((_b = (_a = connection === null || connection === void 0 ? void 0 : connection.manager) === null || _a === void 0 ? void 0 : _a.queryRunner) === null || _b === void 0 ? void 0 : _b.data) {
        connection.manager.queryRunner.data.requestHeaders = headers || {};
    }
}
exports.setHeaders = setHeaders;
function generateContext(headers, extensions) {
    return {
        requestHeaders: headers || {},
        returnedExtensions: extensions || {},
    };
}
exports.generateContext = generateContext;
//# sourceMappingURL=set-up.js.map