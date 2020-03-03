"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.getEntitiesIncludingDeletedConditions = {
    deleted: typeorm_1.In([true, false]),
};
const realityIdCriteria = (includeLinkedOper, headers) => includeLinkedOper && headers.realityId !== 0 && headers.includeLinkedOper
    ? typeorm_1.In([headers.realityId, 0])
    : headers.realityId || 0;
class FindHandler {
    findConditions(includeLinkedOper, polarisOptions) {
        var _a;
        const headers = ((_a = polarisOptions === null || polarisOptions === void 0 ? void 0 : polarisOptions.context) === null || _a === void 0 ? void 0 : _a.requestHeaders) || {};
        let polarisCriteria = {};
        if (typeof (polarisOptions === null || polarisOptions === void 0 ? void 0 : polarisOptions.criteria) === 'string') {
            polarisCriteria = { where: { id: polarisOptions.criteria } };
        }
        else if ((polarisOptions === null || polarisOptions === void 0 ? void 0 : polarisOptions.criteria) instanceof Array) {
            polarisCriteria = { where: { id: typeorm_1.In(polarisOptions.criteria) } };
        }
        else {
            polarisCriteria = (polarisOptions === null || polarisOptions === void 0 ? void 0 : polarisOptions.criteria) || {};
        }
        polarisCriteria.where = Object.assign({}, polarisCriteria.where);
        if (polarisCriteria.where.deleted === undefined) {
            polarisCriteria.where.deleted = false;
        }
        if (polarisCriteria.where.dataVersion === undefined && headers.dataVersion) {
            polarisCriteria.where.dataVersion = typeorm_1.MoreThan(headers.dataVersion);
        }
        if (polarisCriteria.where.realityId === undefined) {
            polarisCriteria.where.realityId = realityIdCriteria(includeLinkedOper, headers);
        }
        return polarisCriteria;
    }
}
exports.FindHandler = FindHandler;
//# sourceMappingURL=find-handler.js.map