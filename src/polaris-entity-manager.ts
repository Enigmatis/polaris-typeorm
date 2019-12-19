import {
    PolarisExtensions,
    PolarisGraphQLContext, PolarisRequestHeaders,
    runAndMeasureTime,
} from '@enigmatis/polaris-common';
import {
    Connection,
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindOneOptions,
    UpdateResult,
} from 'typeorm';
import {DataVersionHandler} from './handlers/data-version-handler';
import {FindHandler} from './handlers/find-handler';
import {SoftDeleteHandler} from './handlers/soft-delete-handler';
import {PolarisFindOneOptions} from "./contextable-options/polaris-find-one-options";
import {PolarisSaveOptions} from "./contextable-options/polaris-save-options";

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
        polarisCriteria: PolarisFindOneOptions<Entity>,
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

        this.connection.logger.log('log', 'finished delete action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async findOne<Entity>(
        entityClass: any,
        polarisCriteria: PolarisFindOneOptions<Entity> | any,
        maybeOptions?: FindOneOptions<Entity>,
    ): Promise<Entity | undefined> {
        const run = await runAndMeasureTime(async () => {
            return super.findOne(
                entityClass,
                this.calculateCriteria<Entity>(entityClass, true, polarisCriteria),
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
        return run.returnValue as any;
    }

    public async find<Entity>(
        entityClass: any,
        polarisCriteria?: PolarisFindOneOptions<Entity> | any,
    ): Promise<Entity[]> {
        const run = await runAndMeasureTime(async () => {
            return super.find(
                entityClass,
                this.calculateCriteria<Entity>(entityClass, true, polarisCriteria),
            );
        });
        if (this.queryRunner) {
            this.queryRunner.data.elapsedTime = run.elapsedTime;
        }
        this.connection.logger.log('log', 'finished find action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async count<Entity>(
        entityClass: any,
        polarisCriteria?: PolarisFindOneOptions<Entity> | any,
    ): Promise<number> {
        const run = await runAndMeasureTime(async () => {
            return super.count(
                entityClass,
                this.calculateCriteria<Entity>(entityClass, false, polarisCriteria),
            );
        });

        // Todo: ElapsedTime

        this.connection.logger.log('log', 'finished count action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async save<Entity, T extends DeepPartial<Entity>>(
        targetOrEntity: any,
        polarisSaveOptions?: PolarisSaveOptions<Entity, T> | any,
        maybeOptions?: any,
    ): Promise<T | T[]> {
        const run = await runAndMeasureTime(async () => {
            if (targetOrEntity.toString().includes('CommonModel')) {
                await this.wrapTransaction(async () => {
                    await this.dataVersionHandler.updateDataVersion(polarisSaveOptions.context);
                    await this.setInfoOfCommonModel(polarisSaveOptions.context, polarisSaveOptions.entities);

                    return super.save(targetOrEntity, polarisSaveOptions.entities);
                });
            } else {
                return super.save(targetOrEntity, polarisSaveOptions.entities || polarisSaveOptions);
            }
        });

        // Todo: get elapsed

        this.connection.logger.log('log', 'finished save action successfully', this.queryRunner);
        return run.returnValue as any;
    }

    public async update<Entity>(
        target: any,
        polarisCriteria: PolarisFindOneOptions<Entity> | any,
        partialEntity: any,
    ): Promise<UpdateResult> {
        const run = await runAndMeasureTime(async () => {
            await this.wrapTransaction(async () => {
                await this.dataVersionHandler.updateDataVersion(polarisCriteria.context);
                const globalDataVersion =
                    polarisCriteria.context.returnedExtensions.globalDataVersion;
                const upnOrRequestingSystemId = polarisCriteria.context.requestHeaders ?
                    (polarisCriteria.context.requestHeaders.upn ||
                      polarisCriteria.context.requestHeaders.requestingSystemId
                    : '';
                partialEntity = {
                    ...partialEntity,
                    dataVersion: globalDataVersion,
                    lastUpdatedBy: upnOrRequestingSystemId
                };
                delete partialEntity.realityId;
                return super.update(target, polarisCriteria.criteria, partialEntity);
            });
        });

        // Todo Elapsed
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

    private async setInfoOfCommonModel(context: PolarisGraphQLContext, maybeEntityOrOptions?: any) {
        if (maybeEntityOrOptions instanceof Array) {
            for (const t of maybeEntityOrOptions) {
                t.dataVersion = context.returnedExtensions.globalDataVersion;
                t.realityId = context.requestHeaders.realityId;
                t.createdBy = context.requestHeaders.upn || context.requestHeaders.requestingSystemId;
            }
        } else {
            maybeEntityOrOptions.dataVersion = context.returnedExtensions.globalDataVersion;
            maybeEntityOrOptions.realityId = context.requestHeaders.realityId;
            maybeEntityOrOptions.createdBy = context.requestHeaders.upn || context.requestHeaders.requestingSystemId;
        }
    }

    private calculateCriteria<Entity>(target: any, includeLinkedOper: boolean, criteria: any) {
        return target.toString().includes('CommonModel')
            ? this.findHandler.findConditions<Entity>(includeLinkedOper, criteria)
            : criteria;
    }
}
