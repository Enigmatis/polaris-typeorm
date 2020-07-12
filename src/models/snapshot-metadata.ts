import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SnapshotMetadata {
    @PrimaryGeneratedColumn('uuid')
    private readonly id: string;

    @CreateDateColumn()
    private lastAccessed: Date;

    @Column("text", { array: true })
    private pagesIds: string[];

    @Column({nullable: true})
    private totalPagesCount: number;

    @Column({nullable: true})
    private currentPageCount: number;

    @Column()
    private status: SnapshotStatus;

    @Column({nullable: true})
    private irrelevantEntities: string;

    @Column({nullable: true})
    private dataVersion: number;

    @Column({nullable: true})
    private totalCount: number;

    @Column({nullable: true})
    private warnings: string;

    @Column({nullable: true})
    private errors: string;

    @CreateDateColumn()
    private readonly creationTime: Date;

    constructor() {
        this.status = SnapshotStatus.IN_PROGRESS;
        this.currentPageCount = 0;
        this.totalPagesCount = 0;
        this.irrelevantEntities = '';
        this.warnings = '';
        this.errors = '';
        this.pagesIds = [];
        this.creationTime = new Date();
        this.lastAccessed = new Date();
    }

    public getId(): string {
        return this.id;
    }

    public setCurrentPageCount(currentPageCount: number): void {
        this.currentPageCount = currentPageCount;
    }

    public setPageIds(pageIds: string[]): void {
        this.pagesIds = pageIds;
    }

    public addWarnings(warnings: string): void {
        this.warnings = this.warnings.concat(warnings);
    }

    public addErrors(errors: string): void {
        this.errors = this.errors.concat(errors);
    }

    public addIrrelevantEntities(irrelevantEntities: string): void {
        this.irrelevantEntities.concat(irrelevantEntities);
    }

    public setSnapshotStatus(snapshotStatus: SnapshotStatus): void {
        this.status = snapshotStatus;
    }

    public setDataVersion(dataVersion: number): void {
        this.dataVersion = dataVersion;
    }

    public setLastAccessedTie(lastAccessed: Date): void {
        this.lastAccessed = lastAccessed;
    }

    public setTotalCount(totalCount: number): void {
        this.totalCount = totalCount;
    }

    public setTotalPagesCount(totalPagesCount: number): void {
        this.totalPagesCount = totalPagesCount;
    }

    public getTotalPagesCount(): number {
        return this.totalPagesCount;
    }

    public getCreationTime(): Date {
        return this.creationTime;
    }

    public getLastAccessedTime(): Date {
        return this.lastAccessed;
    }

    public getCurrentPageCount(): number {
        return this.currentPageCount;
    }
}

export enum SnapshotStatus {
    IN_PROGRESS,
    DONE,
    FAILED,
}
