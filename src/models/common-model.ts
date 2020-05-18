import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonModel {
    @Column({
        name: 'dataVersion',
        type: 'real',
        default: 1,
    })
    protected dataVersion: number;

    @Column({
        name: 'realityId',
        type: 'real',
        default: 0,
    })
    protected realityId: number;

    @Column({ nullable: true })
    protected createdBy?: string;

    @CreateDateColumn()
    protected creationDate: Date;

    @Column({ nullable: true })
    protected lastUpdatedBy?: string;

    @UpdateDateColumn()
    protected lastUpdateDate: Date;

    @Column()
    protected deleted: boolean = false;

    public abstract getId(): string;

    public getDataVersion(): number {
        return this.dataVersion;
    }

    public getRealityId(): number {
        return this.realityId;
    }

    public getCreatedBy(): string | undefined {
        return this.createdBy;
    }

    public getCreationTime(): Date {
        return this.creationDate;
    }

    public getLastUpdatedBy(): string | undefined {
        return this.lastUpdatedBy;
    }

    public getLastUpdateTime(): Date {
        return this.lastUpdateDate;
    }

    public getDeleted(): boolean {
        return this.deleted;
    }

    public setDataVersion(dataVersion: number): void {
        this.dataVersion = dataVersion;
    }
    public setRealityId(realityId: number): void {
        this.realityId = realityId;
    }

    public setCreatedBy(createdBy?: string): void {
        this.createdBy = createdBy;
    }

    public setCreationTime(creationDate: Date): void {
        this.creationDate = creationDate;
    }

    public setLastUpdatedBy(lastUpdatedBy?: string): void {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    public setLastUpdateTime(lastUpdateDate: Date): void {
        this.lastUpdateDate = lastUpdateDate;
    }

    public setDeleted(deleted: boolean): void {
        this.deleted = deleted;
    }
}
