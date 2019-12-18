import {
    PolarisExtensions,
    PolarisGraphQLContext,
    runAndMeasureTime,
} from '@enigmatis/polaris-common';
import {
    Connection,
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    ObjectID,
    SaveOptions,
    UpdateResult,
} from 'typeorm';
import {DataVersionHandler} from './handlers/data-version-handler';
import {FindHandler} from './handlers/find-handler';
import {SoftDeleteHandler} from './handlers/soft-delete-handler';
import {PolarisFindOptions} from "./contextable-options/polaris-find-options";

export class PolarisEntityManager extends EntityManager {
    public dataVersionHandler: DataVersionHandler;
    public findHandler: FindHandler;
    public softDeleteHandler: SoftDeleteHandler;

    constructor(connection: Connection) {
        super(connection, connection.createQueryRunner());
        this.dataVersionHandler = new DataVersionHandler(this);
        this.findHandler = new FindHandler(this);
        this.softDeleteHandler = new SoftDeleteHandler(this);
    }

    public async delete<Entity>(
        targetOrEntity: any,
        polarisCriteria: PolarisFindOptions<Entity>,
    ): Promise<DeleteResult> {
        const run = await runAndMeasureTime(async () => {
            await this.wrapTransaction(async () => {
                await this.dataVersionHandler.updateDataVersion(polarisCriteria.context);
                const config = this.connection.options.extra.config;
                if (
                    (config && config.allowSoftDelete === false) ||
                    !targetOrEntity.toString().includes('CommonModel')
                ) {
                    return super.delete(targetOrEntity, polarisCriteria.criteria);
                }
                return this.softDeleteHandler.softDeleteRecursive(
                    targetOrEntity,
                    polarisCriteria.criteria,
                );
            });
        });

        //TODO:
        // get elapsed time into the context
        polarisCriteria.context.returnedExtensions.irrelevantEntities = ["hi"];

        this.connection.logger.log('log', 'finished delete action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async findOne<Entity>(
        entityClass: any,
        polarisCriteria: PolarisFindOptions<Entity> | any,
        maybeOptions?: FindOneOptions<Entity>,
    ): Promise<Entity | undefined> {
        const run = await runAndMeasureTime(async () => {
            return super.findOne(
                entityClass,
                this.calculateCriteria(entityClass, true, polarisCriteria.criteria | polarisCriteria),
                maybeOptions,
            );
        });

        // Todo:
        // save elapsed time in the context

        this.connection.logger.log(
            'log',
            'finished find one action successfully',
            this.queryRunner,
        );
        polarisCriteria.context.returnedExtensions.poop = true;
        return run.returnValue as any;
    }

    public async find<Entity>(
        entityClass: any,
        polarisCriteria?: PolarisFindOptions<Entity> | any,
    ): Promise<Entity[]> {
        const run = await runAndMeasureTime(async () => {
            return super.find(
                entityClass,
                this.calculateCriteria(entityClass, true, polarisCriteria.criteria),
            );
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.elapsedTime;
        }
        this.connection.logger.log('log', 'finished find action successfully', this.queryRunner);
        polarisCriteria.context.returnedExtensions.irrelevantEntities = ["poopsik"];
        return run.returnValue as any;
    }

    public async count<Entity>(
        entityClass: any,
        polarisCriteria?: { criteria: FindManyOptions<Entity> | any, context: PolarisGraphQLContext } | any,
    ): Promise<number> {
        const run = await runAndMeasureTime(async () => {
            return super.count(
                entityClass,
                this.calculateCriteria(entityClass, false, polarisCriteria.criteria),
            );
        });

        // Todo: ElapsedTime

        this.connection.logger.log('log', 'finished count action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async save<Entity, T extends DeepPartial<Entity>>(
        targetOrEntity: any,
        polarisSave?: { entities: T | T[], context: PolarisGraphQLContext } | any,
        maybeOptions?: any,
    ): Promise<T | T[]> {
        const run = await runAndMeasureTime(async () => {
            if (targetOrEntity.toString().includes('CommonModel')) {
                await this.wrapTransaction(async () => {
                    await this.dataVersionHandler.updateDataVersion(polarisSave.context);
                    await this.saveDataVersion(polarisSave.context.returnedExtensions, polarisSave.entities);
                    return super.save(targetOrEntity, polarisSave.entities);
                });
            } else {
                return super.save(targetOrEntity, polarisSave.entities);
            }
        });
        // Todo: get elapsed
        // if (polarisSave.context) {
        //     polarisSave.context.elapsedTime = run.elapsedTime;
        // }
        this.connection.logger.log('log', 'finished save action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async update<Entity>(
        target: any,
        polarisCriteria: {
            criteria: | string
                | string[]
                | number
                | number[]
                | Date
                | Date[]
                | ObjectID
                | ObjectID[]
                | any,
            context: PolarisGraphQLContext
        } | any,
        partialEntity: any,
    ): Promise<UpdateResult> {
        const run = await runAndMeasureTime(async () => {
            await this.wrapTransaction(async () => {
                await this.dataVersionHandler.updateDataVersion(polarisCriteria.context);
                const globalDataVersion =
                    polarisCriteria.context.returnedExtensions.globalDataVersion;
                partialEntity = {...partialEntity, dataVersion: globalDataVersion};
                return super.update(target, polarisCriteria.criteria, partialEntity);
            });
        });

        // Todo Elapsed
        // if (polarisCriteria.context) {
        //     polarisCriteria.context.elapsedTime = run.elapsedTime;
        // }
        this.connection.logger.log('log', 'finished update action successfully', this.queryRunner);
        return run.returnValue as any;
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

    private async saveDataVersion(extensions: PolarisExtensions, maybeEntityOrOptions?: any) {
        if (maybeEntityOrOptions instanceof Array) {
            for (const t of maybeEntityOrOptions) {
                t.dataVersion = extensions.globalDataVersion;
            }
        } else {
            maybeEntityOrOptions.dataVersion = extensions.globalDataVersion;
        }
    }

    private calculateCriteria(target: any, includeLinkedOper: boolean, criteria: any) {
        return target.toString().includes('CommonModel')
            ? this.findHandler.findConditions(includeLinkedOper, criteria)
            : criteria;
    }
}
