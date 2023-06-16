import { CartItemEntity } from '@/carts/entities/item.entity';
import { UserEntity } from '@/users/user.entity';
import { Exclude, Expose } from 'class-transformer';
import {
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinColumn,
    OneToMany,
    OneToOne,
    Entity,
} from 'typeorm';

@Entity('carts')
export class CartEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Exclude({ toPlainOnly: true })
    @JoinColumn({ name: 'user_id' })
    @OneToOne(() => UserEntity, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    public client: UserEntity;

    @OneToMany(() => CartItemEntity, (item) => item.cart, {
        nullable: false,
        eager: true,
    })
    public items: CartItemEntity[];

    @Expose({ name: 'totalPrice', toPlainOnly: true })
    public getTotalPrice(): number {
        if (!this.items || this.items.length === 0) {
            return 0;
        }

        return this.items
            .map((product) => product.price())
            .reduce((prev, next) => prev + next);
    }
}
