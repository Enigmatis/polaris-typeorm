import {PolarisContext} from "../common-polaris";

export const realityIdWithLinkedOperCriteria = (context: PolarisContext) =>
    context && context.realityId ? context.includeLinkedOper ? {where: {realityId: [context.realityId, 0]}} : {where: {realityId: context.realityId}} : {where: {realityId: 0}};

export const realityIdCriteria = (context: PolarisContext) =>
    context && context.realityId ? {where: {realityId: context.realityId}} : {where: {realityId: 0}};