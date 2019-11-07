import { runAndMeasureTime } from '@enigmatis/polaris-common';
import {
    Connection,
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    In,
    Not,
    ObjectID,
    SaveOptions,
    UpdateResult,
} from 'typeorm';
import { DataVersionHandler } from './handlers/data-version-handler';
import { dataVersionCriteria, FindHandler } from './handlers/find-handler';
import { SoftDeleteHandler } from './handlers/soft-delete-handler';

export class PolarisEntityManager extends EntityManager {
    private dataVersionHandler: DataVersionHandler;
    private findHandler: FindHandler;
    private softDeleteHandler: SoftDeleteHandler;

    constructor(connection: Connection) {
        super(connection, connection.createQueryRunner());
        if (this.queryRunner) {
            this.queryRunner.data = { context: {} };
        }
        this.dataVersionHandler = new DataVersionHandler(this);
        this.findHandler = new FindHandler(this);
        this.softDeleteHandler = new SoftDeleteHandler(this);
    }

    public async delete<Entity>(
        targetOrEntity: any,
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | any,
    ): Promise<DeleteResult> {
        const run = await runAndMeasureTime(async () => {
            const calculatedCriteria: FindManyOptions = this.calculateCriteria(
                targetOrEntity,
                false,
                criteria,
            );
            const metadata = this.connection.entityMetadatas.find(
                meta => meta.target === targetOrEntity,
            );
            if (metadata) {
                calculatedCriteria.relations = metadata.relations.map(
                    relation => relation.propertyName,
                );
            }
            const entities: Entity[] = await super.find(targetOrEntity, calculatedCriteria);
            if (entities.length > 0) {
                const config = this.connection.options.extra.config;
                if (config && config.softDelete && config.softDelete.allow === false) {
                    return this.wrapTransaction(async () => {
                        await this.dataVersionHandler.updateDataVersion();
                        return super.delete(targetOrEntity, calculatedCriteria);
                    });
                }
                return this.softDeleteHandler.softDeleteRecursive(targetOrEntity, entities);
            } else {
                throw new Error('there are no entities to delete');
            }
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log('log', 'finished delete action successfully', this.queryRunner);
        return run.returnValue;
    }

    public async findOne<Entity>(
        entityClass: any,
        idOrOptionsOrConditions?:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | FindOneOptions<Entity>
            | any,
        maybeOptions?: FindOneOptions<Entity>,
    ): Promise<Entity | undefined> {
        const run = await runAndMeasureTime(async () => {
            return super.findOne(
                entityClass,
                this.calculateCriteria(entityClass, true, idOrOptionsOrConditions),
                maybeOptions,
            );
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log(
            'log',
            'finished find one action successfully',
            this.queryRunner,
        );
        return run.returnValue;
    }

    public async find<Entity>(
        entityClass: any,
        optionsOrConditions?: FindManyOptions<Entity> | any,
    ): Promise<Entity[]> {
        const run = await runAndMeasureTime(async () => {
            const results: any = await super.find(
                entityClass,
                this.calculateCriteria(entityClass, true, optionsOrConditions),
            );
            const irrelevantWhereCriteria: any =
                results.length > 0 ? { id: Not(In(results.map((x: any) => x.id))) } : {};
            irrelevantWhereCriteria.dataVersion = dataVersionCriteria(this.getContext());
            let irrelevant: any = await super.find(entityClass, {
                select: ['id'],
                where: irrelevantWhereCriteria,
            });
            irrelevant = irrelevant.map((x: any) => x.id);
            this.getContext().res.locals.tempIrrelevant = irrelevant;

            return results;
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log('log', 'finished find action successfully', this.queryRunner);
        return run.returnValue;
    }

    public async count<Entity>(
        entityClass: any,
        optionsOrConditions?: FindManyOptions<Entity> | any,
    ): Promise<number> {
        const run = await runAndMeasureTime(async () => {
            return super.count(
                entityClass,
                this.calculateCriteria(entityClass, false, optionsOrConditions),
            );
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log('log', 'finished count action successfully', this.queryRunner);
        return run.returnValue;
    }

    public async save<Entity, T extends DeepPartial<Entity>>(
        targetOrEntity: any,
        maybeEntityOrOptions?: T | T[],
        maybeOptions?: SaveOptions,
    ): Promise<T | T[]> {
        const run = await runAndMeasureTime(async () => {
            if (targetOrEntity.toString().includes('CommonModel')) {
                await this.wrapTransaction(async () => {
                    await this.dataVersionHandler.updateDataVersion();
                    await this.saveDataVersionAndRealityId(maybeEntityOrOptions);
                    return super.save(targetOrEntity, maybeEntityOrOptions, maybeOptions);
                });
            } else {
                return super.save(targetOrEntity, maybeEntityOrOptions, maybeOptions);
            }
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log('log', 'finished save action successfully', this.queryRunner);
        return run.returnValue;
    }

    public async update<Entity>(
        target: any,
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | any,
        partialEntity: any,
    ): Promise<UpdateResult> {
        const run = await runAndMeasureTime(async () => {
            await this.wrapTransaction(async () => {
                await this.dataVersionHandler.updateDataVersion();
                const globalDataVersion = this.getContext().globalDataVersion;
                partialEntity = { ...partialEntity, ...{ dataVersion: globalDataVersion } };
                return super.update(target, criteria, partialEntity);
            });
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.time;
        }
        this.connection.logger.log('log', 'finished update action successfully', this.queryRunner);
        return run.returnValue;
    }

    private async wrapTransaction(action: any) {
        const runner: any = this.queryRunner;
        try {
            let transactionStartedByUs = false;
            if (!runner.isTransactionActive) {
                await runner.startTransaction();
                transactionStartedByUs = true;
            }
            const result = await action();
            if (transactionStartedByUs) {
                await runner.commitTransaction();
            }
            return result;
        } catch (err) {
            if (this.queryRunner) {
                this.queryRunner.data.logError = true;
            }
            this.connection.logger.log('log', err.message, this.queryRunner);
            await runner.rollbackTransaction();
        }
    }

    private async saveDataVersionAndRealityId(maybeEntityOrOptions?: any) {
        if (maybeEntityOrOptions instanceof Array) {
            for (const t of maybeEntityOrOptions) {
                t.dataVersion = this.getContext().globalDataVersion;
                this.setRealityIdOfEntity(t);
            }
        } else {
            maybeEntityOrOptions.dataVersion = this.getContext().globalDataVersion;
            this.setRealityIdOfEntity(maybeEntityOrOptions);
        }
    }

    private setRealityIdOfEntity(entity: any) {
        const realityIdFromHeader = this.getContext().realityId || 0;
        if (entity.realityId === undefined) {
            entity.realityId = realityIdFromHeader;
        } else if (entity.realityId !== realityIdFromHeader) {
            throw new Error('reality id of entity is different from header');
        }
    }

    private getContext = () => {
        return this.queryRunner ? this.queryRunner.data.context : {};
    };

    private calculateCriteria(target: any, includeLinkedOper: boolean, criteria: any) {
        return target.toString().includes('CommonModel')
            ? this.findHandler.findConditions(includeLinkedOper, criteria)
            : criteria;
    }
}
