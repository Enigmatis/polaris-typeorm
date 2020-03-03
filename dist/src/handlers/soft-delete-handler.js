"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const polaris_criteria_1 = require("../contextable-options/polaris-criteria");
class SoftDeleteHandler {
    constructor(manager) {
        this.manager = manager;
    }
    async softDeleteRecursive(targetOrEntity, polarisCriteria) {
        const softDeletedEntities = await this.updateWithReturningIds(targetOrEntity, polarisCriteria.criteria, {
            deleted: true,
            lastUpdatedBy: polarisCriteria &&
                polarisCriteria.context &&
                polarisCriteria.context.requestHeaders &&
                (polarisCriteria.context.requestHeaders.upn ||
                    polarisCriteria.context.requestHeaders.requestingSystemName),
        });
        if (softDeletedEntities.affected === 0) {
            return softDeletedEntities;
        }
        const metadata = this.manager.connection.getMetadata(targetOrEntity);
        if (metadata && metadata.relations) {
            for (const relation of metadata.relations) {
                const relationMetadata = relation.inverseEntityMetadata;
                const hasCascadeDeleteFields = relationMetadata.foreignKeys.filter(foreign => foreign.onDelete === 'CASCADE' &&
                    foreign.referencedEntityMetadata === metadata).length > 0;
                const isCommonModel = relationMetadata.inheritanceTree.find(ancestor => ancestor.name === 'CommonModel') !== undefined;
                if (isCommonModel && hasCascadeDeleteFields) {
                    const x = {};
                    x[relation.propertyName] = typeorm_1.In(softDeletedEntities.raw.map((row) => row.id));
                    await this.softDeleteRecursive(relationMetadata.targetName, new polaris_criteria_1.PolarisCriteria(x, polarisCriteria.context));
                }
            }
        }
        return softDeletedEntities;
    }
    updateWithReturningIds(target, criteria, partialEntity) {
        // if user passed empty criteria or empty list of criterias, then throw an error
        if (criteria === undefined ||
            criteria === null ||
            criteria === '' ||
            (criteria instanceof Array && criteria.length === 0)) {
            return Promise.reject(new Error(`Empty criteria(s) are not allowed for the delete method.`));
        }
        if (typeof criteria === 'string' || criteria instanceof Array) {
            return this.manager
                .createQueryBuilder()
                .update(target)
                .set(partialEntity)
                .whereInIds(criteria)
                .returning('id')
                .execute();
        }
        else {
            return this.manager
                .createQueryBuilder()
                .update(target)
                .set(partialEntity)
                .where(criteria)
                .returning('id')
                .execute();
        }
    }
}
exports.SoftDeleteHandler = SoftDeleteHandler;
//# sourceMappingURL=soft-delete-handler.js.map