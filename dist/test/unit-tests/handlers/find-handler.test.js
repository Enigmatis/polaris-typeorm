"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const polaris_find_many_options_1 = require("../../../src/contextable-options/polaris-find-many-options");
const find_handler_1 = require("../../../src/handlers/find-handler");
describe('find handler tests', () => {
    it('dataVersion property supplied in options or conditions and not in headers, get with data version condition', async () => {
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({ where: { dataVersion: 5 } }, {}));
        expect(find).toEqual({ where: { deleted: false, realityId: 0, dataVersion: 5 } });
    });
    it('realityId property supplied in options or conditions and not in the headers, get condition of given reality', async () => {
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({ where: { realityId: 3 } }, {}));
        expect(find).toEqual({ where: { deleted: false, realityId: 3 } });
    });
    it('include linked oper is true in headers, get realities of real and reality in headers', async () => {
        const context = {
            requestHeaders: { realityId: 1, includeLinkedOper: true },
        };
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({}, context));
        expect(find).toEqual({ where: { deleted: false, realityId: typeorm_1.In([1, 0]) } });
    });
    it('include linked oper is true in headers, get condition of default reality', async () => {
        const context = {
            requestHeaders: { realityId: 0, includeLinkedOper: true },
        };
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({}, context));
        expect(find).toEqual({ where: { deleted: false, realityId: 0 } });
    });
    it('include linked oper is true in headers but false in find setting, get condition of reality in headers', async () => {
        const context = {
            requestHeaders: { realityId: 1, includeLinkedOper: true },
        };
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(false, new polaris_find_many_options_1.PolarisFindManyOptions({}, context));
        expect(find).toEqual({ where: { deleted: false, realityId: 1 } });
    });
    it('deleted property supplied in options or conditions, get condition of supplied setting', async () => {
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({ where: { deleted: true } }, {}));
        expect(find).toEqual({ where: { deleted: true, realityId: 0 } });
    });
    it('linked oper supplied in header property, supplied in options or conditions, get only from headers reality', async () => {
        const context = {
            requestHeaders: { realityId: 1 },
        };
        const findHandler = new find_handler_1.FindHandler();
        const find = findHandler.findConditions(true, new polaris_find_many_options_1.PolarisFindManyOptions({ where: { includeLinkedOper: true } }, {
            requestHeaders: { realityId: 1 },
        }));
        expect(find).toEqual({ where: { deleted: false, realityId: 1, includeLinkedOper: true } });
    });
});
//# sourceMappingURL=find-handler.test.js.map