import { Author } from './author';
import { Book } from './book';
export declare class Library {
    name: string;
    author: Author;
    books: Book[];
    id: string;
    private dataVersion;
    private realityId;
    private createdBy;
    private creationTime;
    private lastUpdatedBy;
    private lastUpdateTime;
    private deleted;
    constructor(name?: string, books?: Book[]);
}
