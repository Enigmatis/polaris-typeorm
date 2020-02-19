import { Column, Entity } from 'typeorm';
import { CommonModel } from '../../src';

@Entity()
export class Profile extends CommonModel {
    @Column()
    public gender: string;
    constructor(id: string, gender?: string) {
        super(id);
        if (gender) {
            this.gender = gender;
        }
    }
}
