// @ts-ignore
import {Author} from "./author";
import {CommonModel} from "../../index";
import {Column, Entity, JoinColumn, OneToOne,} from "typeorm";

@Entity()
export class Book extends CommonModel {

    constructor(title?: string, author?: Author, dataVersion?: number) {
        super();
        title ? this.title = title : {};
        author ? this.author = author : {};
        dataVersion ? super.dataVersion = dataVersion : {};
    }

    @Column()
    title: string;

    @OneToOne(type => Author)
    @JoinColumn()
    author: Author;
}