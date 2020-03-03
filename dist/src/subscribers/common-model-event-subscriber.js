"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const polaris_common_1 = require("@enigmatis/polaris-common");
const typeorm_1 = require("typeorm");
const __1 = require("..");
let CommonModelEventSubscriber = class CommonModelEventSubscriber {
    listenTo() {
        return __1.CommonModel;
    }
    async beforeInsert(event) {
        if (event.entity) {
            event.connection.logger.log('log', 'prePersist began', event.queryRunner);
            await polaris_common_1.runAndMeasureTime(async () => {
                const now = new Date();
                event.entity.setCreationTime(now);
                event.entity.setLastUpdateTime(now);
            });
            event.connection.logger.log('log', 'prePersist finished');
        }
    }
    async beforeUpdate(event) {
        if (event.entity) {
            event.connection.logger.log('log', 'preUpdate began');
            await polaris_common_1.runAndMeasureTime(async () => {
                const now = new Date();
                event.entity.setLastUpdateTime(now);
            });
            event.connection.logger.log('log', 'preUpdate finished');
        }
    }
};
CommonModelEventSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], CommonModelEventSubscriber);
exports.CommonModelEventSubscriber = CommonModelEventSubscriber;
//# sourceMappingURL=common-model-event-subscriber.js.map