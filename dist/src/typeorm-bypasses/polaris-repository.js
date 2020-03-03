"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const polaris_criteria_1 = require("../contextable-options/polaris-criteria");
const polaris_find_many_options_1 = require("../contextable-options/polaris-find-many-options");
const polaris_find_one_options_1 = require("../contextable-options/polaris-find-one-options");
const polaris_save_options_1 = require("../contextable-options/polaris-save-options");
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
class PolarisRepository extends typeorm_1.Repository {
    /**
     * Saves one or many given entities.
     */
    // @ts-ignore
    save(context, entityOrEntities, options) {
        return this.manager.save(this.metadata.target, new polaris_save_options_1.PolarisSaveOptions(entityOrEntities, context), options);
    }
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    // @ts-ignore
    update(context, criteria, partialEntity) {
        return this.manager.update(this.metadata.target, new polaris_criteria_1.PolarisCriteria(criteria, context), partialEntity);
    }
    /**
     * Deletes entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     */
    // @ts-ignore
    delete(context, criteria) {
        return this.manager.delete(this.metadata.target, new polaris_criteria_1.PolarisCriteria(criteria, context));
    }
    /**
     * Counts entities that match given find options or conditions.
     */
    // @ts-ignore
    count(context, optionsOrConditions) {
        return this.manager.count(this.metadata.target, new polaris_find_many_options_1.PolarisFindManyOptions(optionsOrConditions, context));
    }
    /**
     * Finds entities that match given find options or conditions.
     */
    // @ts-ignore
    find(context, optionsOrConditions) {
        return this.manager.find(this.metadata.target, new polaris_find_many_options_1.PolarisFindManyOptions(optionsOrConditions, context));
    }
    /**
     * Finds first entity that matches given conditions.
     */
    // @ts-ignore
    findOne(context, optionsOrConditions, maybeOptions) {
        return this.manager.findOne(this.metadata.target, new polaris_find_one_options_1.PolarisFindOneOptions(optionsOrConditions, context), maybeOptions);
    }
}
exports.PolarisRepository = PolarisRepository;
//# sourceMappingURL=polaris-repository.js.map