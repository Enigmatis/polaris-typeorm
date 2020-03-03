import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { CommonModel } from '..';
export declare class CommonModelEventSubscriber implements EntitySubscriberInterface<CommonModel> {
    listenTo(): typeof CommonModel;
    beforeInsert(event: InsertEvent<CommonModel>): Promise<void>;
    beforeUpdate(event: UpdateEvent<CommonModel>): Promise<void>;
}
