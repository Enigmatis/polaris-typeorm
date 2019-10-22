import {TypeORMConfig, PolarisContext} from "../common-polaris";
import {MoreThan} from "typeorm";

const softDeleteCriteria = (config?: TypeORMConfig) =>
    config && config.softDelete && config.softDelete.returnEntities ? {} : {where: {deleted: false}};

const dataVersionCriteria = (context: PolarisContext) =>
    context && context.dataVersion != undefined ? {where: {dataVersion: MoreThan(context.dataVersion)}} : {};

const realityIdWithLinkedOperCriteria = (context: PolarisContext) =>
    context && context.realityId ? context.includeLinkedOper ? {where: {realityId: [context.realityId, 0]}} : {where: {realityId: context.realityId}} : {where: {realityId: 0}};

export const realityIdCriteria = (context: PolarisContext) =>
    context && context.realityId ? {where: {realityId: context.realityId}} : {where: {realityId: 0}};

export const findConditions = (context: PolarisContext, config: TypeORMConfig, optionsOrConditions?: any) => {
    optionsOrConditions = optionsOrConditions ? optionsOrConditions : {};
    let polarisCriteria = {where: {...optionsOrConditions.where, ...dataVersionCriteria(context).where, ...softDeleteCriteria(config).where, ...realityIdWithLinkedOperCriteria(context).where}};
    optionsOrConditions.where = polarisCriteria.where;
    return optionsOrConditions;
};