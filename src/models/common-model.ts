import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonModel {
    @Column({
        name: 'dataVersion',
        type: 'real',
        default: 1,
    })
    protected dataVersion: number;

    @Column({
        name: 'REALITYID',
        type: 'real',
        default: 0,
    })
    protected realityId: number;

    @Column({ name: 'CREATEDBY', nullable: true })
    protected createdBy?: string;

    @CreateDateColumn({ name: 'CREATIONDATE' })
    protected creationTime: Date;

    @Column({ name: 'LASTUPDATEDBY', nullable: true })
    protected lastUpdatedBy?: string;

    @UpdateDateColumn({ name: 'LASTUPDATEDATE' })
    protected lastUpdateTime: Date;

    @Column({ name: 'DELETED' })
    protected deleted: boolean = false;

    @Column({ name: 'CLASSIFICATION', nullable: true })
    protected classification: string;

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
        return this.creationTime;
    }

    public getLastUpdatedBy(): string | undefined {
        return this.lastUpdatedBy;
    }

    public getLastUpdateTime(): Date {
        return this.lastUpdateTime;
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

    public setCreationTime(creationTime: Date): void {
        this.creationTime = creationTime;
    }

    public setLastUpdatedBy(lastUpdatedBy?: string): void {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    public setLastUpdateTime(lastUpdateTime: Date): void {
        this.lastUpdateTime = lastUpdateTime;
    }

    public setDeleted(deleted: boolean): void {
        this.deleted = deleted;
    }
}
