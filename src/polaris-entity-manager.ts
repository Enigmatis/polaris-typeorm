import {
    Connection, DeepPartial, DeleteResult, EntityManager, EntitySchema,
    FindManyOptions, FindOneOptions, ObjectID, ObjectType, SaveOptions, UpdateResult
} from "typeorm";
import {softDeleteRecursive} from "./handlers/soft-delete-handler";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {DataVersion} from "./models/data-version";
import {updateDataVersionInEntity} from "./handlers/data-version-handler";
import {PolarisConfig, PolarisContext, runAndMeasureTime} from "./common-polaris";
import {CommonModel} from "./models/common-model";
import {realityIdCriteria} from "./handlers/reality-handler";
import {findConditions} from "./handlers/find-handler";
//todo: check if throw error logs an error in mgf
//todo: typeorm not supporting exist
//todo: paging in db
//todo: saveandflush
//todo: find all ids including deleted elements for irrelevant entities query select by entitiy only spec is reality
export class PolarisEntityManager extends EntityManager {

    config: PolarisConfig;
    logger: any;

    constructor(connection: Connection, config: PolarisConfig, logger: any) {
        super(connection, connection.createQueryRunner());
        this.queryRunner.data = {context: {}};
        this.config = config;
        this.logger = logger;
    }

    async delete<Entity extends CommonModel>(targetOrEntity: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        let run = await runAndMeasureTime(async () => {
            criteria.where = {...criteria.where, ...realityIdCriteria(this.queryRunner.data.context)};
            let entities: Entity[] = await this.find(targetOrEntity, criteria);
            if (entities.length > 0) {
                if (this.config && this.config.softDelete && this.config.softDelete.allow == false) {
                    try {
                        await this.queryRunner.startTransaction();
                        await updateDataVersionInEntity(this);
                        let deleteResult = await super.delete(targetOrEntity, criteria);
                        await this.queryRunner.commitTransaction();
                        return deleteResult;
                    } catch (err) {
                        await this.queryRunner.rollbackTransaction();
                    }
                }
                return await softDeleteRecursive(targetOrEntity, entities, this);
            } else {
                throw new Error('there are no entities to delete');
            }
        });
        this.logger.debug('finished delete action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }

    async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<Entity> | any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        let run = await runAndMeasureTime(async () => {
            // @ts-ignore
            return super.findOne(entityClass, findConditions(this.queryRunner.data.context, this.config, idOrOptionsOrConditions), maybeOptions);
        });
        this.logger.debug('finished find one action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }

    async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<Entity[]> {
        let run = await runAndMeasureTime(async () => {
            let entityClassType: any = entityClass;
            // @ts-ignore
            return super.find(entityClass,
                entityClassType.name == "DataVersion" ? optionsOrConditions : findConditions(this.queryRunner.data.context, this.config, optionsOrConditions));
        });
        this.logger.debug('finished find action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }


    async count<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, optionsOrConditions?: FindManyOptions<Entity> | any): Promise<number> {
        let run = await runAndMeasureTime(() => {
            optionsOrConditions = optionsOrConditions ? optionsOrConditions : {};
            optionsOrConditions.where = realityIdCriteria(this.queryRunner.data.context);
            // @ts-ignore
            return super.count(entityClass, findConditions(this.queryRunner.data.context, this.config, optionsOrConditions));
        });
        this.logger.debug('finished count action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }

    async save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: (T | T[]) | ObjectType<Entity> | EntitySchema<Entity> | string, maybeEntityOrOptions?: T | T[], maybeOptions?: SaveOptions): Promise<T | T[]> {
        let target: any = targetOrEntity;
        let run = await runAndMeasureTime(async () => {
            if (target.name != "DataVersion") {
                try {
                    await this.queryRunner.startTransaction();
                    await this.saveDataVersionAndRealityId(target, maybeEntityOrOptions);
                    let save = await super.save(target, maybeEntityOrOptions, maybeOptions);
                    await this.queryRunner.commitTransaction();
                    return save;
                } catch (err) {
                    await this.queryRunner.rollbackTransaction();
                }
            } else {
                return await super.save(target, maybeEntityOrOptions, maybeOptions);
            }
        });
        this.logger.debug('finished save action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }


    async update<Entity>(target: { new(): Entity } | Function | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        let run = await runAndMeasureTime(async () => {
            try {
                await this.queryRunner.startTransaction();
                await updateDataVersionInEntity(this);
                partialEntity = {...partialEntity, ...{dataVersion: this.queryRunner.data.context.globalDataVersion}};
                let updateResult = super.update(target, criteria, partialEntity);
                await this.queryRunner.commitTransaction();
                return updateResult;
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
            }
        });
        this.logger.debug('finished update action successfully', {
            context: this.queryRunner.data.context,
            polarisLogProperties: {elapsedTime: run.time}
        });
        return run.returnValue;
    }

    async saveDataVersionAndRealityId(targetOrEntity: any, maybeEntityOrOptions?: any) {
        await updateDataVersionInEntity(this);
        if (maybeEntityOrOptions instanceof Array) {
            for (let t of maybeEntityOrOptions) {
                t.dataVersion = this.queryRunner.data.context.globalDataVersion;
                this.setRealityIdOfEntity(t);
            }
        } else {
            maybeEntityOrOptions.dataVersion = this.queryRunner.data.context.globalDataVersion;
            this.setRealityIdOfEntity(maybeEntityOrOptions);
        }
    }

    setRealityIdOfEntity<Entity extends CommonModel>(entity: Entity) {
        let realityId = this.queryRunner.data.context.realityId;
        realityId = realityId ? realityId : 0;
        if (entity.realityId === undefined || entity.realityId == realityId) {
            entity.realityId = realityId
        } else {
            throw new Error('reality id of entity is different from header');
        }
    }
}