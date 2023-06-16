import { ProductEntity } from '@/products/product.entity';
import { CartEntity } from '@/carts/entities/cart.entity';
import { Expose } from 'class-transformer';
import {
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
    Column,
    Entity,
} from 'typeorm';

@Entity('cart_items')
export class CartItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @JoinColumn({ name: 'cart_id' })
    @ManyToOne(() => CartEntity, (cart) => cart.items, {
        nullable: false,
    })
    public cart: CartEntity;

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
