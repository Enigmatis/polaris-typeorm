import {PolarisEntityManager} from "../polaris-entity-manager";
import {DataVersion} from "../models/data-version";

export async function updateDataVersion<Entity>(polarisEntityManager: PolarisEntityManager) {
    let logger = polarisEntityManager.logger;
    let polarisContext = polarisEntityManager.queryRunner.data.context;
    logger.debug('Started data version job when inserting/updating entity', {context: polarisContext});
    let result = await polarisEntityManager.findOne(DataVersion);
    if (!result) {
        logger.debug('no data version found', {context: polarisContext});
        await polarisEntityManager.save(DataVersion, new DataVersion(1));
        logger.debug('data version created', {context: polarisContext});
        polarisContext.globalDataVersion = 1;
    } else {
        if (!polarisContext.globalDataVersion) {
            logger.debug('context does not hold data version', {context: polarisContext});
            await polarisEntityManager.increment(DataVersion, {}, 'value', 1);
            polarisContext.globalDataVersion = (await polarisEntityManager.findOne(DataVersion, {})).value + 1;
            logger.debug('data version is incremented and holds new value ', {context: polarisContext});
        }
    }
    logger.debug('Finished data version job when inserting/updating entity', {context: polarisContext});
}
