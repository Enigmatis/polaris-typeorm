import { CommonModel } from '../../src';
import { Book } from './book';
import { Library } from './library';
export declare class Author extends CommonModel {
    name: string;
    books: Book[];
    libraries: Library[];
    protected id: string;
    constructor(name?: string, books?: Book[]);
    getId(): string;
}
