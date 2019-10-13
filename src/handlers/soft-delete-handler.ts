import {PolarisConfig} from "../polaris-entity-manager";

export function softDeleteHandler(config?: PolarisConfig): Object{
    if (config && config.softDelete && config.softDelete.returnEntities) {
        return {};
    }
    return {deleted: false};
}