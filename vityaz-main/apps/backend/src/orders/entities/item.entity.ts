import { PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { OrderEntity } from '@/orders/entities/order.entity';
import { ProductEntity } from '@/products/product.entity';
import { BaseEntity, Entity } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @JoinColumn({ name: 'order_id' })
    @ManyToOne(() => OrderEntity, (order) => order.items, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    public order: OrderEntity;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(() => ProductEntity, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: true,
    })
    public product: ProductEntity;

    @Column({ name: 'quantity', nullable: false, default: 1 })
    public quantity: number;

    @Expose({ toPlainOnly: true })
    public price() {
        return this.product.price * this.quantity;
    }
}
