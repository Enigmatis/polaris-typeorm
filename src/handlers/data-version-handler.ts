import {PolarisContext, PolarisEntityManager} from "../polaris-entity-manager";
import {DataVersion} from "../models/data-version";
import {MoreThan} from "typeorm";

export async function updateDataVersionInEntity<Entity>(polarisEntityManager: PolarisEntityManager) {
    let polarisContext = polarisEntityManager.queryRunner.data.context;
    if (!polarisContext) return;
    let logger = polarisContext.logger;
    logger ? logger.debug('Started data version job when inserting/updating entity') : {};
    let dataVersionRepository = polarisEntityManager.getRepository(DataVersion);
    let result = await dataVersionRepository.find();
    if (result.length == 0) {
        logger ? logger.debug('no data version found') : {};
        await dataVersionRepository.save(new DataVersion(1));
        logger ? logger.debug('data version created') : {};
        polarisContext.globalDataVersion = 1;
    } else {
        if (!polarisContext.globalDataVersion) {
            logger ? logger.debug('context does not hold data version') : {};
            let oldDataVersion = result[0].value;
            await dataVersionRepository.increment({}, 'value', 1);
            polarisContext.globalDataVersion = oldDataVersion + 1;
            logger ? logger.debug('data version is incremented and holds new value ' + polarisContext.globalDataVersion) : {};
        }
    }
    logger ? logger.debug('Finished data version job when inserting/updating entity') : {};
}

export const dataVersionCriteria = (context: PolarisContext) =>
    context && context.dataVersion != undefined ? {where: {dataVersion: MoreThan(context.dataVersion)}} : {};
