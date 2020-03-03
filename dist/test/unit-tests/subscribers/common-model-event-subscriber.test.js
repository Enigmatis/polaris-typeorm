"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_model_event_subscriber_1 = require("../../../src/subscribers/common-model-event-subscriber");
const book_1 = require("../../dal/book");
let bookEntity;
let commonModelEventSubscriber;
describe('common model event subscriber tests', () => {
    beforeEach(async () => {
        bookEntity = new book_1.Book();
        commonModelEventSubscriber = new common_model_event_subscriber_1.CommonModelEventSubscriber();
    });
    describe('beforeInsert tests', () => {
        it('all the common model fields defined as needed', async () => {
            const connection = getConnection();
            const event = new DummyInsertEvent(connection, bookEntity);
            Object.assign(connection.manager.connection, connection);
            await commonModelEventSubscriber.beforeInsert(event);
            expect(bookEntity.getCreationTime()).toBeDefined();
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('without upn and with requesting system id', async () => {
            const connection = getConnection();
            const event = new DummyInsertEvent(connection, bookEntity);
            Object.assign(connection.manager.connection, connection);
            await commonModelEventSubscriber.beforeInsert(event);
            expect(bookEntity.getCreationTime()).toBeDefined();
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('without reality id, so reality id is the default(which is 0)', async () => {
            const connection = getConnection();
            const event = new DummyInsertEvent(connection, bookEntity);
            Object.assign(connection.manager.connection, connection);
            await commonModelEventSubscriber.beforeInsert(event);
            expect(bookEntity.getCreationTime()).toBeDefined();
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('check that the logger called as needed', async () => {
            const connection = getConnection();
            const event = new DummyInsertEvent(connection, bookEntity);
            await commonModelEventSubscriber.beforeInsert(event);
            expect(connection.logger.log).toBeCalledTimes(2);
        });
    });
    describe('beforeUpdate tests', () => {
        it('all the common model fields defined as needed', async () => {
            const connection = getConnection();
            const event = new DummyUpdateEvent(connection, bookEntity);
            await commonModelEventSubscriber.beforeUpdate(event);
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('without upn and with requesting system id', async () => {
            const connection = getConnection();
            const event = new DummyUpdateEvent(connection, bookEntity);
            await commonModelEventSubscriber.beforeUpdate(event);
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('without reality id, so reality id is the default(which is 0)', async () => {
            const connection = getConnection();
            const event = new DummyUpdateEvent(connection, bookEntity);
            Object.assign(connection.manager.connection, connection);
            await commonModelEventSubscriber.beforeUpdate(event);
            expect(bookEntity.getLastUpdateTime()).toBeDefined();
        });
        it('check that the logger called as needed', async () => {
            const connection = getConnection();
            const event = new DummyUpdateEvent(connection, bookEntity);
            await commonModelEventSubscriber.beforeUpdate(event);
            expect(connection.logger.log).toBeCalledTimes(2);
        });
    });
});
function getConnection() {
    return {
        manager: { connection: {} },
        logger: { log: jest.fn() },
    };
}
class DummyInsertEvent {
    constructor(connection, entity) {
        this.connection = connection;
        this.entity = entity;
        this.manager = connection.manager;
    }
}
// tslint:disable-next-line:max-classes-per-file
class DummyUpdateEvent {
    constructor(connection, entity) {
        this.connection = connection;
        this.entity = entity;
        this.manager = connection.manager;
    }
}
//# sourceMappingURL=common-model-event-subscriber.test.js.map