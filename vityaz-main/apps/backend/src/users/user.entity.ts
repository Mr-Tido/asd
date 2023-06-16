import { PrimaryGeneratedColumn, BaseEntity, Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Roles } from '@/@types/Roles';

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ name: 'firstname', type: 'varchar', nullable: true })
    public firstname: string | null;

    @Column({ name: 'lastname', type: 'varchar', nullable: true })
    public lastname: string | null;

    @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
    public email: string;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'password', type: 'varchar', nullable: false })
    public password: string;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'role', enum: Roles })
    public role: Roles;

    @Exclude({ toPlainOnly: true })
    @Column({ name: 'refresh', type: 'varchar', nullable: true })
    public refresh: string | null;
}
