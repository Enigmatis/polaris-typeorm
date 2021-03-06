import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonModel } from '../../src';
import { Book } from './book';
import { Library } from './library';

@Entity()
export class Author extends CommonModel {
    @Column({ nullable: true })
    public name: string;

    @OneToMany(
        () => Book,
        books => books.author,
    )
    public books: Book[];

    @OneToMany(
        () => Library,
        libraries => libraries.author,
    )
    public libraries: Library[];

    @PrimaryGeneratedColumn()
    protected id: string;

    constructor(name?: string, books?: Book[]) {
        super();
        if (name) {
            this.name = name;
        }
        if (books) {
            this.books = books;
        }
    }

    public getId(): string {
        return this.id;
    }
}
