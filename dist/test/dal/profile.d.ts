import { CommonModel } from '../../src';
export declare class Profile extends CommonModel {
    gender: string;
    protected id: string;
    constructor(gender?: string);
    getId(): string;
}
