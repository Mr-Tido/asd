import { UserEntity } from 'src/users/user.entity';
import {
    PrimaryGeneratedColumn,
    JoinColumn,
    BaseEntity,
    OneToOne,
    Column,
    Entity,
} from 'typeorm';

@Entity('confirmations')
export class ConfirmationEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @JoinColumn({ name: 'user_id' })
    @OneToOne(() => UserEntity, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: true,
    })
    public user: UserEntity;

    @Column({ name: 'email', type: 'varchar', nullable: false })
    public email: string;

    @Column({ name: 'code', nullable: false })
    public code: number;
}
