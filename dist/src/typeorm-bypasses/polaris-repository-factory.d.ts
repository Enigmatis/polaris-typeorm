// @ts-nocheck
import { EntityManager, EntityMetadata, QueryRunner } from 'typeorm';
import { PolarisRepository } from './polaris-repository';
export declare class PolarisRepositoryFactory {
    create(manager: EntityManager, metadata: EntityMetadata, queryRunner?: QueryRunner): PolarisRepository<any>;
}
