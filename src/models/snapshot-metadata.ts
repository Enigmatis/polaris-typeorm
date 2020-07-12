import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SnapshotMetadata {
    @PrimaryGeneratedColumn('uuid')
    private readonly id: string;

    @CreateDateColumn()
    private lastAccessed: Date;

    @Column()
    private pagesIds: string[];

    @Column()
    private pagesCount: number;

    @Column()
    private currentPageIndex: number;

    @Column()
    private status: SnapshotStatus;

    @Column()
    private irrelevantEntities: string;

    @Column()
    private dataVersion: BigInt;

    @Column()
    private totalCount: number;

    @Column()
    private warnings: string;

    @Column()
    private errors: string;

    @CreateDateColumn()
    private readonly creationTime: Date;

    constructor() {
        this.status = SnapshotStatus.IN_PROGRESS;
        this.currentPageIndex = 0;
        this.lastAccessed = new Date();
    }

    public getId(): string {
        return this.id;
    }

    public setCurrentPageIndex(currentPageIndex: number): void {
        this.currentPageIndex = currentPageIndex;
    }

    public addPageId(pageId: string): void {
        if (!this.pagesIds) {
            this.pagesIds = [];
        }
        this.pagesIds.push(pageId);
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

    public setDataVersion(dataVersion: BigInt): void {
        this.dataVersion = dataVersion;
    }

    public setLastAccessedTie(lastAccessed: Date): void {
        this.lastAccessed = lastAccessed;
    }

    public setTotalCount(totalCount: number): void {
        this.totalCount = totalCount;
    }

    public getPagesCount(): number {
        return this.pagesCount;
    }

    public getCreationTime(): Date {
        return this.creationTime;
    }

    public getLastAccessedTime(): Date {
        return this.lastAccessed;
    }
}

export enum SnapshotStatus {
    IN_PROGRESS,
    DONE,
    FAILED,
}
