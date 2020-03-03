"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class CommonModel {
    constructor() {
        this.deleted = false;
    }
    getDataVersion() {
        return this.dataVersion;
    }
    getRealityId() {
        return this.realityId;
    }
    getCreatedBy() {
        return this.createdBy;
    }
    getCreationTime() {
        return this.creationTime;
    }
    getLastUpdatedBy() {
        return this.lastUpdatedBy;
    }
    getLastUpdateTime() {
        return this.lastUpdateTime;
    }
    getDeleted() {
        return this.deleted;
    }
    setDataVersion(dataVersion) {
        this.dataVersion = dataVersion;
    }
    setRealityId(realityId) {
        this.realityId = realityId;
    }
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }
    setCreationTime(creationTime) {
        this.creationTime = creationTime;
    }
    setLastUpdatedBy(lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }
    setLastUpdateTime(lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }
    setDeleted(deleted) {
        this.deleted = deleted;
    }
}
__decorate([
    typeorm_1.Column({
        name: 'dataVersion',
        type: 'real',
        default: 1,
    }),
    __metadata("design:type", Number)
], CommonModel.prototype, "dataVersion", void 0);
__decorate([
    typeorm_1.Column({
        name: 'realityId',
        type: 'real',
        default: 0,
    }),
    __metadata("design:type", Number)
], CommonModel.prototype, "realityId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CommonModel.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], CommonModel.prototype, "creationTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CommonModel.prototype, "lastUpdatedBy", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], CommonModel.prototype, "lastUpdateTime", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], CommonModel.prototype, "deleted", void 0);
exports.CommonModel = CommonModel;
//# sourceMappingURL=common-model.js.map