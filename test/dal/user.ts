import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonModel } from '../../src';
import { Profile } from './profile';

@Entity()
export class User extends CommonModel {
    @Column()
    public name: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    public profile: Profile;
    constructor(id: string, name?: string, profile?: Profile) {
        super(id);
        if (name) {
            this.name = name;
        }
        if (profile) {
            this.profile = profile;
        }
    }
}
