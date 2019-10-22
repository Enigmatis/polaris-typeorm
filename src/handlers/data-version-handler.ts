import {PolarisEntityManager} from "../polaris-entity-manager";
import {DataVersion} from "../models/data-version";

export class DataVersionHandler {
    polarisEntityManager: PolarisEntityManager;
    logger: any;

    constructor(polarisEntityManager: PolarisEntityManager) {
        this.polarisEntityManager = polarisEntityManager;
        this.logger = polarisEntityManager.logger;
    }

    async updateDataVersion<Entity>() {
        let polarisContext = this.polarisEntityManager.queryRunner.data.context;
        this.logger.debug('Started data version job when inserting/updating entity', {context: polarisContext});
        let result = await this.polarisEntityManager.findOne(DataVersion);
        if (!result) {
            this.logger.debug('no data version found', {context: polarisContext});
            await this.polarisEntityManager.save(DataVersion, new DataVersion(1));
            this.logger.debug('data version created', {context: polarisContext});
            polarisContext.globalDataVersion = 1;
        } else {
            if (!polarisContext.globalDataVersion) {
                this.logger.debug('context does not hold data version', {context: polarisContext});
                await this.polarisEntityManager.increment(DataVersion, {}, 'value', 1);
                polarisContext.globalDataVersion = (await this.polarisEntityManager.findOne(DataVersion, {})).value + 1;
                this.logger.debug('data version is incremented and holds new value ', {context: polarisContext});
            }
        }
        this.logger.debug('Finished data version job when inserting/updating entity', {context: polarisContext});
    }

}