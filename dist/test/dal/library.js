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
const author_1 = require("./author");
const book_1 = require("./book");
let Library = class Library {
    constructor(name, books) {
        this.deleted = false;
        if (name) {
            this.name = name;
        }
        if (books) {
            this.books = books;
        }
    }
};
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Library.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => author_1.Author, author => author.libraries, { onDelete: 'CASCADE' }),
    __metadata("design:type", author_1.Author)
], Library.prototype, "author", void 0);
__decorate([
    typeorm_1.OneToMany(() => book_1.Book, books => books.library),
    __metadata("design:type", Array)
], Library.prototype, "books", void 0);
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Library.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'dataVersion',
        type: 'real',
        default: 0,
    }),
    __metadata("design:type", Number)
], Library.prototype, "dataVersion", void 0);
__decorate([
    typeorm_1.Column({
        name: 'realityId',
        type: 'real',
        default: 0,
    }),
    __metadata("design:type", Number)
], Library.prototype, "realityId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Library.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Library.prototype, "creationTime", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Library.prototype, "lastUpdatedBy", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Library.prototype, "lastUpdateTime", void 0);
__decorate([
    typeorm_1.Column({
        name: 'deleted',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Library.prototype, "deleted", void 0);
Library = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Array])
], Library);
exports.Library = Library;
//# sourceMappingURL=library.js.map