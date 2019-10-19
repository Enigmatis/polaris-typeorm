import {PolarisConfig} from "../polaris-entity-manager";

export const softDeleteCriteria = (config?: PolarisConfig) =>
    config && config.softDelete && config.softDelete.returnEntities ? {} : {where: {deleted: false}};