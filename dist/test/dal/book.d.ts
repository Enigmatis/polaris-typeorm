import { CommonModel } from '../../src';
import { Author } from './author';
import { Library } from './library';
export declare class Book extends CommonModel {
    title: string;
    author: Author;
    library: Library;
    protected id: string;
    constructor(title?: string, author?: Author);
    getId(): string;
}
