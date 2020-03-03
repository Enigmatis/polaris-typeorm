"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polaris_repository_1 = require("./polaris-repository");
class PolarisRepositoryFactory {
    create(manager, metadata, queryRunner) {
        const repository = new polaris_repository_1.PolarisRepository();
        Object.assign(repository, {
            manager,
            metadata,
            queryRunner,
        });
        return repository;
    }
}
exports.PolarisRepositoryFactory = PolarisRepositoryFactory;
//# sourceMappingURL=polaris-repository-factory.js.map