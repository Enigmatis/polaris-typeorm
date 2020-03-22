import {PolarisRequestHeaders} from '@enigmatis/polaris-common';
import {FindConditions, In, MoreThan} from 'typeorm';
import {PolarisFindManyOptions, PolarisFindOneOptions} from '..';

export const getEntitiesIncludingDeletedConditions: FindConditions<any> = {
    deleted: In([true, false]),
};

const realityIdCriteria = (includeLinkedOper: boolean, headers: PolarisRequestHeaders) =>
    includeLinkedOper && headers.realityId !== 0 && headers.includeLinkedOper
        ? In([headers.realityId, 0])
        : headers.realityId || 0;

export class FindHandler {
    public findConditions<Entity>(
        includeLinkedOper: boolean,
        polarisOptions?: PolarisFindManyOptions<Entity> | PolarisFindOneOptions<Entity>,
    ) {
        const headers: PolarisRequestHeaders = polarisOptions?.context?.requestHeaders || {};

        let polarisCriteria: any;
        if (typeof polarisOptions?.criteria === 'string') {
            polarisCriteria = {where: {id: polarisOptions.criteria}};
        } else if (polarisOptions?.criteria instanceof Array) {
            polarisCriteria = {where: {id: In(polarisOptions.criteria)}};
        } else {
            polarisCriteria = polarisOptions?.criteria || {};
        }

        polarisCriteria.where = {...polarisCriteria.where};
        this.setDeletedCriteriaIncludingRelations(polarisCriteria);
        if (polarisCriteria.where.dataVersion === undefined && headers.dataVersion) {
            polarisCriteria.where.dataVersion = MoreThan(headers.dataVersion);
        }
        if (polarisCriteria.where.realityId === undefined) {
            polarisCriteria.where.realityId = realityIdCriteria(includeLinkedOper, headers);
        }
        return polarisCriteria;
    }

    private setDeletedCriteriaIncludingRelations(polarisCriteria: any) {
        if (polarisCriteria.where.deleted === undefined) {
            polarisCriteria.where.deleted = false;

            if (polarisCriteria.relations) {
                polarisCriteria.relations.forEach((relation: any) => {
                    polarisCriteria.where = this.setNestedDeleteFilter(relation, polarisCriteria.where);
                });

            }
        }
    }

    private setNestedDeleteFilter(key: string, object: any) {
        let result: any;
        result = object;
        let deleted = false;
        let relations = key.split(".");
        relations.forEach((relation: string ) => {
            object = object[relation] = {deleted, ...object[relation]};
        });

        return result;
    }
}
