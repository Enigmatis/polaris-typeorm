import {EntityManager} from "typeorm";
import {DataVersion} from "..";

export class DataVersionHandler {
    manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    async updateDataVersion<Entity>() {
        let context = this.manager.queryRunner ? this.manager.queryRunner.data.context : {};
        this.manager.connection.logger.log("log", 'Started data version job when inserting/updating entity');
        let result = await this.manager.findOne(DataVersion);
        if (!result) {
            if (context.globalDataVersion) {
                throw new Error("data version in context even though the data version table is empty");
            }
            this.manager.connection.logger.log("log", 'no data version found');
            await this.manager.save(DataVersion, new DataVersion(1));
            this.manager.connection.logger.log("log", 'data version created');
            context.globalDataVersion = 1;
        } else {
            if (!context.globalDataVersion) {
                this.manager.connection.logger.log("log", 'context does not hold data version');
                await this.manager.increment(DataVersion, {}, 'value', 1);
                let newResult = await this.manager.findOne(DataVersion);
                if (newResult) {
                    context.globalDataVersion = newResult.value;
                } else {
                    throw new Error("global data version was supposed to increment but does not exist");
                }
                this.manager.connection.logger.log("log", 'data version is incremented and holds new value ');
            } else {
                if (context.globalDataVersion != result.value) {
                    throw new Error("data version in context does not equal data version in table");
                }
            }
        }
        this.manager.connection.logger.log("log", 'Finished data version job when inserting/updating entity');
    }
}