"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class DataVersionHandler {
    constructor(manager) {
        this.manager = manager;
    }
    async updateDataVersion(context) {
        const extensions = (context && context.returnedExtensions) || {};
        this.manager.connection.logger.log('log', 'Started data version job when inserting/updating entity');
        const result = await this.manager.findOne(__1.DataVersion);
        if (!result) {
            if (extensions.globalDataVersion) {
                throw new Error('data version in context even though the data version table is empty');
            }
            this.manager.connection.logger.log('log', 'no data version found');
            await this.manager.save(__1.DataVersion, new __1.DataVersion(1));
            this.manager.connection.logger.log('log', 'data version created');
            extensions.globalDataVersion = 1;
        }
        else {
            if (!extensions.globalDataVersion) {
                this.manager.connection.logger.log('log', 'context does not hold data version');
                await this.manager.increment(__1.DataVersion, {}, 'value', 1);
                const newResult = await this.manager.findOne(__1.DataVersion);
                if (newResult) {
                    extensions.globalDataVersion = newResult.getValue();
                }
                else {
                    throw new Error('global data version was supposed to increment but does not exist');
                }
                this.manager.connection.logger.log('log', 'data version is incremented and holds new value ');
            }
            else {
                if (extensions.globalDataVersion !== result.getValue()) {
                    throw new Error('data version in context does not equal data version in table');
                }
            }
        }
        if (context && extensions) {
            context.returnedExtensions = extensions;
        }
        this.manager.connection.logger.log('log', 'Finished data version job when inserting/updating entity');
    }
}
exports.DataVersionHandler = DataVersionHandler;
//# sourceMappingURL=data-version-handler.js.map