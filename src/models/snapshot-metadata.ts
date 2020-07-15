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
    private pagesCount: number;

    @Column({ nullable: true })
    private currentPageIndex: number;

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
        this.currentPageIndex = 0;
        this.pagesCount = 0;
        this.pagesIds = [];
        this.creationTime = new Date();
        this.lastAccessedTime = new Date();
    }

    public getId(): string {
        return this.id;
    }

    public setCurrentPageIndex(currentPageIndex: number): void {
        this.currentPageIndex = currentPageIndex;
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

    public setPagesCount(pagesCount: number): void {
        this.pagesCount = pagesCount;
    }

    public getPagesCount(): number {
        return this.pagesCount;
    }

    public getCreationTime(): Date {
        return this.creationTime;
    }

    public getLastAccessedTime(): Date {
        return this.lastAccessedTime;
    }

    public getCurrentPageIndex(): number {
        return this.currentPageIndex;
    }

    public getStatus(): SnapshotStatus {
        return this.status;
    }
}

export enum SnapshotStatus {
    IN_PROGRESS = <any>'IN_PROGRESS',
    DONE = <any>'DONE',
    FAILED = <any>'FAILED',
}
