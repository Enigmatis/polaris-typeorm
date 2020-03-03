export declare abstract class CommonModel {
    protected dataVersion: number;
    protected realityId: number;
    protected createdBy?: string;
    protected creationTime: Date;
    protected lastUpdatedBy?: string;
    protected lastUpdateTime: Date;
    protected deleted: boolean;
    abstract getId(): string;
    getDataVersion(): number;
    getRealityId(): number;
    getCreatedBy(): string | undefined;
    getCreationTime(): Date;
    getLastUpdatedBy(): string | undefined;
    getLastUpdateTime(): Date;
    getDeleted(): boolean;
    setDataVersion(dataVersion: number): void;
    setRealityId(realityId: number): void;
    setCreatedBy(createdBy?: string): void;
    setCreationTime(creationTime: Date): void;
    setLastUpdatedBy(lastUpdatedBy?: string): void;
    setLastUpdateTime(lastUpdateTime: Date): void;
    setDeleted(deleted: boolean): void;
}
