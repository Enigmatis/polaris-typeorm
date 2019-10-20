import {dataVersionCriteria} from "./data-version-handler";
import {softDeleteCriteria} from "./soft-delete-handler";
import {realityIdWithLinkedOperCriteria} from "./reality-handler";
import {PolarisConfig, PolarisContext} from "../common-polaris";

export const findConditions = (context: PolarisContext, config: PolarisConfig, optionsOrConditions?: any) => {
    optionsOrConditions = optionsOrConditions ? optionsOrConditions : {};
    let where = {where: {...optionsOrConditions.where, ...dataVersionCriteria(context).where, ...softDeleteCriteria(config).where, ...realityIdWithLinkedOperCriteria(context).where}};
    optionsOrConditions.where = where.where;
    return optionsOrConditions;
};