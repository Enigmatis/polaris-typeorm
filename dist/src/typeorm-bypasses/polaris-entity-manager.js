"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const RepositoryNotFoundError_1 = require("typeorm/error/RepositoryNotFoundError");
const __1 = require("..");
const data_version_handler_1 = require("../handlers/data-version-handler");
const find_handler_1 = require("../handlers/find-handler");
const soft_delete_handler_1 = require("../handlers/soft-delete-handler");
const polaris_repository_factory_1 = require("./polaris-repository-factory");
class PolarisEntityManager extends typeorm_1.EntityManager {
    constructor(connection) {
        super(connection, connection === null || connection === void 0 ? void 0 : connection.createQueryRunner());
        this.dataVersionHandler = new data_version_handler_1.DataVersionHandler(this);
        this.findHandler = new find_handler_1.FindHandler();
        this.softDeleteHandler = new soft_delete_handler_1.SoftDeleteHandler(this);
    }
    static async setInfoOfCommonModel(context, maybeEntityOrOptions) {
        var _a, _b, _c, _d, _e, _f;
        if (maybeEntityOrOptions instanceof Array) {
            for (const t of maybeEntityOrOptions) {
                t.dataVersion = (_a = context === null || context === void 0 ? void 0 : context.returnedExtensions) === null || _a === void 0 ? void 0 : _a.globalDataVersion;
                t.realityId = (_c = (_b = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _b === void 0 ? void 0 : _b.realityId) !== null && _c !== void 0 ? _c : 0;
                PolarisEntityManager.setUpnOfEntity(t, context);
            }
        }
        else if (maybeEntityOrOptions instanceof Object) {
            maybeEntityOrOptions.dataVersion = (_d = context === null || context === void 0 ? void 0 : context.returnedExtensions) === null || _d === void 0 ? void 0 : _d.globalDataVersion;
            maybeEntityOrOptions.realityId = (_f = (_e = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _e === void 0 ? void 0 : _e.realityId) !== null && _f !== void 0 ? _f : 0;
            PolarisEntityManager.setUpnOfEntity(maybeEntityOrOptions, context);
        }
    }
    static setUpnOfEntity(entity, context) {
        var _a, _b, _c, _d;
        if (context === null || context === void 0 ? void 0 : context.requestHeaders) {
            if (entity.creationTime !== undefined) {
                entity.createdBy =
                    ((_a = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _a === void 0 ? void 0 : _a.upn) || ((_b = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _b === void 0 ? void 0 : _b.requestingSystemId);
            }
            else {
                entity.lastUpdatedBy =
                    ((_c = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _c === void 0 ? void 0 : _c.upn) || ((_d = context === null || context === void 0 ? void 0 : context.requestHeaders) === null || _d === void 0 ? void 0 : _d.requestingSystemId);
            }
        }
    }
    // @ts-ignore
    getRepository(target) {
        // throw exception if there is no repository with this target registered
        if (!this.connection.hasMetadata(target)) {
            throw new RepositoryNotFoundError_1.RepositoryNotFoundError(this.connection.name, target);
        }
        // find already created repository instance and return it if found
        const metadata = this.connection.getMetadata(target);
        const repository = this.repositories.find(repo => repo.metadata === metadata);
        if (repository) {
            return repository;
        }
        // if repository was not found then create it, store its instance and return it
        const newRepository = new polaris_repository_factory_1.PolarisRepositoryFactory().create(this, metadata, this.queryRunner);
        this.repositories.push(newRepository);
        return newRepository;
    }
    async delete(targetOrEntity, criteria) {
        if (criteria instanceof __1.PolarisCriteria) {
            return this.wrapTransaction(async () => {
                var _a, _b;
                criteria.context = criteria.context || {};
                await this.dataVersionHandler.updateDataVersion(criteria.context);
                if (((_b = (_a = this.connection.options.extra) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.allowSoftDelete) === false ||
                    !targetOrEntity.toString().includes(__1.CommonModel.name)) {
                    return super.delete(targetOrEntity, criteria.criteria);
                }
                return this.softDeleteHandler.softDeleteRecursive(targetOrEntity, criteria);
            });
        }
        else {
            return super.delete(targetOrEntity, criteria);
        }
    }
    async findOne(entityClass, criteria, maybeOptions) {
        if (criteria instanceof __1.PolarisFindOneOptions) {
            return super.findOne(entityClass, this.calculateCriteria(entityClass, true, criteria), maybeOptions);
        }
        else {
            return super.findOne(entityClass, criteria, maybeOptions);
        }
    }
    async find(entityClass, criteria) {
        if (criteria instanceof __1.PolarisFindManyOptions) {
            return super.find(entityClass, this.calculateCriteria(entityClass, true, criteria));
        }
        else {
            return super.find(entityClass, criteria);
        }
    }
    async count(entityClass, criteria) {
        if (criteria instanceof __1.PolarisFindManyOptions) {
            return super.count(entityClass, this.calculateCriteria(entityClass, false, criteria));
        }
        else {
            return super.count(entityClass, criteria);
        }
    }
    async save(targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        if (maybeEntityOrOptions instanceof __1.PolarisSaveOptions &&
            targetOrEntity.toString().includes(__1.CommonModel.name)) {
            return this.wrapTransaction(async () => {
                maybeEntityOrOptions.context = maybeEntityOrOptions.context || {};
                await this.dataVersionHandler.updateDataVersion(maybeEntityOrOptions.context);
                await PolarisEntityManager.setInfoOfCommonModel(maybeEntityOrOptions.context, maybeEntityOrOptions.entities);
                return super.save(targetOrEntity, maybeEntityOrOptions.entities, maybeOptions);
            });
        }
        else {
            if (maybeEntityOrOptions instanceof __1.PolarisSaveOptions) {
                maybeEntityOrOptions = maybeEntityOrOptions.entities;
            }
            return super.save(targetOrEntity, maybeEntityOrOptions, maybeOptions);
        }
    }
    async update(target, criteria, partialEntity) {
        if (criteria instanceof __1.PolarisCriteria) {
            return this.wrapTransaction(async () => {
                criteria.context = criteria.context || {};
                await this.dataVersionHandler.updateDataVersion(criteria.context);
                const globalDataVersion = criteria.context.returnedExtensions.globalDataVersion;
                const upnOrRequestingSystemId = criteria.context.requestHeaders
                    ? criteria.context.requestHeaders.upn ||
                        criteria.context.requestHeaders.requestingSystemId
                    : '';
                partialEntity = Object.assign(Object.assign({}, partialEntity), { dataVersion: globalDataVersion, lastUpdatedBy: upnOrRequestingSystemId });
                delete partialEntity.realityId;
                return super.update(target, criteria.criteria, partialEntity);
            });
        }
        else {
            return super.update(target, criteria, partialEntity);
        }
    }
    async wrapTransaction(action) {
        const runner = this.queryRunner;
        try {
            let transactionStartedByUs = false;
            if (!runner.isTransactionActive) {
                await runner.startTransaction();
                transactionStartedByUs = true;
            }
            const result = await action();
            if (transactionStartedByUs) {
                await runner.commitTransaction();
            }
            return result;
        }
        catch (err) {
            this.connection.logger.log('log', err.message);
            await runner.rollbackTransaction();
            throw err;
        }
    }
    calculateCriteria(target, includeLinkedOper, criteria) {
        return target.toString().includes(__1.CommonModel.name)
            ? this.findHandler.findConditions(includeLinkedOper, criteria)
            : criteria;
    }
}
exports.PolarisEntityManager = PolarisEntityManager;
//# sourceMappingURL=polaris-entity-manager.js.map