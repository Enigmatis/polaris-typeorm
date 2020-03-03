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
const author_1 = require("./author");
const library_1 = require("./library");
let Book = class Book extends src_1.CommonModel {
    constructor(title, author) {
        super();
        if (title) {
            this.title = title;
        }
        if (author) {
            this.author = author;
        }
    }
    getId() {
        return this.id;
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    typeorm_1.ManyToOne(() => author_1.Author, author => author.books, { onDelete: 'CASCADE' }),
    __metadata("design:type", author_1.Author)
], Book.prototype, "author", void 0);
__decorate([
    typeorm_1.ManyToOne(() => library_1.Library, library => library.books, { onDelete: 'CASCADE' }),
    __metadata("design:type", library_1.Library)
], Book.prototype, "library", void 0);
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
Book = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, author_1.Author])
], Book);
exports.Book = Book;
//# sourceMappingURL=book.js.map