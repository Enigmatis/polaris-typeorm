import {PolarisConfig} from "../polaris-entity-manager";

export const softDeleteHandler = (config?: PolarisConfig) => {
    if (config && config.softDelete && config.softDelete.returnEntities) {
        return {};
    }
    return {deleted: false};
};