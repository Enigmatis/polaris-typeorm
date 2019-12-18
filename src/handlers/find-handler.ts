import {PolarisRequestHeaders} from '@enigmatis/polaris-common';
import {EntityManager, In, MoreThan} from 'typeorm';

export const getAllEntitiesIncludingDeleted = {where: {deleted: In([true, false])}};

const realityIdCriteria = (includeLinkedOper: boolean, headers: PolarisRequestHeaders) =>
    includeLinkedOper && headers.realityId !== 0 && headers.includeLinkedOper
        ? In([headers.realityId, 0])
        : headers.realityId || 0;

export class FindHandler {
    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    public findConditions(includeLinkedOper: boolean, polarisOptions?: any) {
        const headers: PolarisRequestHeaders =
            (polarisOptions &&
                polarisOptions.context &&
                polarisOptions.context.requestHeaders) || {};
        const polarisCriteria = (polarisOptions && polarisOptions.criteria) || {};

        polarisCriteria.where = {...polarisCriteria.where};
        if (polarisCriteria.where.deleted === undefined) {
            polarisCriteria.where.deleted = false;
        }
        if (polarisCriteria.where.dataVersion === undefined && headers.dataVersion) {
            polarisCriteria.where.dataVersion = MoreThan(headers.dataVersion);
        }
        if (polarisCriteria.where.realityId === undefined) {
            polarisCriteria.where.realityId = realityIdCriteria(includeLinkedOper, headers);
        }
        return polarisCriteria;
    }
}
