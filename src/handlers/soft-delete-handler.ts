import { PolarisEntityManager} from "../polaris-entity-manager";
import {CommonModel} from "../models/common-model";
import {PolarisConfig} from "../common-polaris";

export const softDeleteCriteria = (config?: PolarisConfig) =>
    config && config.softDelete && config.softDelete.returnEntities ? {} : {where: {deleted: false}};

// todo: if the field is common modal or list of common model and cascade all or cascade remove is on soft delete it too and field is not syntethic tru update
export const softDeleteRecursive = async (targetOrEntity: any, entities: CommonModel[], entityManager: PolarisEntityManager) => {
    for (let entity of entities) {
        entity.deleted = true;
    }
    await entityManager.save(targetOrEntity, entities);
};