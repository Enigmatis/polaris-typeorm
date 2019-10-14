// @ts-ignore
import {CommonModel} from "../../index";
import {Column, Entity} from "typeorm";

@Entity()
export class Author extends CommonModel {

    constructor(firstName?: string, lastName?: string) {
        super();
        firstName ? this.firstName = firstName : {};
        lastName ? this.lastName = lastName : {};
    }

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}