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
const src_1 = require("../../src");
const profile_1 = require("./profile");
let User = class User extends src_1.CommonModel {
    constructor(name, profile) {
        super();
        if (name) {
            this.name = name;
        }
        if (profile) {
            this.profile = profile;
        }
    }
    getId() {
        return this.id;
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToOne(() => profile_1.Profile),
    typeorm_1.JoinColumn(),
    __metadata("design:type", profile_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, profile_1.Profile])
], User);
exports.User = User;
//# sourceMappingURL=user.js.map