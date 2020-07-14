import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SnapshotMetadata {
    @PrimaryGeneratedColumn('uuid')
    private readonly id: string;

    @CreateDateColumn()
    private lastAccessedTime: Date;

    @Column('text', { array: true })
    private pagesIds: string[];

    @Column({ nullable: true })
    private totalPagesCount: number;

    @Column({ nullable: true })
    private currentPageCount: number;

    @Column('text')
    private status: SnapshotStatus;

    @Column({ nullable: true })
    private irrelevantEntities: string;

    @Column({ nullable: true })
    private dataVersion: number;

    @Column({ nullable: true })
    private totalCount: number;

    @Column({ nullable: true })
    private warnings: string;

    @Column({ nullable: true })
    private errors: string;

    @CreateDateColumn()
    private readonly creationTime: Date;

    constructor() {
        this.status = SnapshotStatus.IN_PROGRESS;
        this.currentPageCount = 0;
        this.totalPagesCount = 0;
        this.pagesIds = [];
        this.creationTime = new Date();
        this.lastAccessedTime = new Date();
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

    public addWarnings(warningsToAdd: string): void {
        if (warningsToAdd) {
            if (!this.warnings) {
                this.warnings = '';
            }
            this.warnings = this.warnings.concat(warningsToAdd);
        }
    }

    public addErrors(errorsToAdd: string): void {
        if (errorsToAdd) {
            if (!this.errors) {
                this.errors = '';
            }
            this.errors = this.errors.concat(errorsToAdd);
        }
    }

    public setIrrelevantEntities(irrelevantEntities: string): void {
        this.irrelevantEntities = irrelevantEntities;
    }

    public setSnapshotStatus(snapshotStatus: SnapshotStatus): void {
        this.status = snapshotStatus;
    }

    public setDataVersion(dataVersion: number): void {
        this.dataVersion = dataVersion;
    }

    public setLastAccessedTime(lastAccessed: Date): void {
        this.lastAccessedTime = lastAccessed;
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
        return this.lastAccessedTime;
    }

    public getCurrentPageCount(): number {
        return this.currentPageCount;
    }
}

export enum SnapshotStatus {
    IN_PROGRESS = <any>'IN_PROGRESS',
    DONE = <any>'DONE',
    FAILED = <any>'FAILED',
}
