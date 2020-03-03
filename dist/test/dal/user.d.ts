import { CommonModel } from '../../src';
import { Profile } from './profile';
export declare class User extends CommonModel {
    name: string;
    profile: Profile;
    protected id: string;
    constructor(name?: string, profile?: Profile);
    getId(): string;
}
