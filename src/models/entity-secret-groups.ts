import { Column, Entity } from 'typeorm';

@Entity()
export class EntitySecretGroups {
    @Column()
    public secretGroups: Set<string>;
}
