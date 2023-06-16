import { OrderItemEntity } from '@/orders/entities/item.entity';
import { UserEntity } from '@/users/user.entity';
import { Statuses } from '@/orders/Statuses';
import { Expose } from 'class-transformer';
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Entity,
    Column,
} from 'typeorm';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @OneToMany(() => OrderItemEntity, (item) => item.order, {
        cascade: true,
        eager: true,
    })
    public items: OrderItemEntity[];

    @JoinColumn({ name: 'client_id' })
    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    public client: UserEntity;

    @Column({ enum: Statuses, nullable: false })
    public status: Statuses;

    @Expose({ name: 'totalPrice', toPlainOnly: true })
    public getTotalPrice(): number {
        return this.items
            .map((product) => product.price())
            .reduce((prev, next) => prev + next);
    }
}
