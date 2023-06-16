import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItemEntity } from '@/carts/entities/item.entity';
import { ProductEntity } from '@/products/product.entity';
import { CartEntity } from '@/carts/entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartsRepository: Repository<CartEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemsRepository: Repository<CartItemEntity>,
        @InjectRepository(ProductEntity)
        private readonly productsRepository: Repository<ProductEntity>,
    ) {}

    public async getCart(client: UserEntity): Promise<CartEntity> {
        let cart = await this.cartsRepository.findOneBy({
            client: { id: client.id },
        });

        if (cart) {
            return cart;
        }

        cart = await this.cartsRepository
            .create({
                client: { id: client.id },
            })
            .save();
        await cart.reload();
        return cart;
    }

    public async removeItemFromCart(
        client: UserEntity,
        itemId: string,
    ): Promise<CartEntity> {
        const cart = await this.getCart(client);

        const item = await this.getItemOfCart(cart, itemId);

        await item.remove();
        await cart.reload();

        return cart;
    }

    public async setQuantityOfItem(
        client: UserEntity,
        itemId: string,
        quantity: number,
    ): Promise<CartEntity> {
        const cart = await this.getCart(client);
        const item = await this.getItemOfCart(cart, itemId);

        item.quantity = quantity;

        await item.save();
        await cart.reload();

        return cart;
    }

    public async addProductToCart(
        client: UserEntity,
        productId: string,
    ): Promise<void> {
        const productExists = await this.productsRepository.exist({
            where: { id: productId },
        });

        if (!productExists) {
            throw new NotFoundException('Product not found');
        }

        await this.addItemToCart(client, productId);
    }

    private async addItemToCart(
        client: UserEntity,
        itemId: string,
    ): Promise<CartItemEntity> {
        const cart = await this.getCart(client);

        const item = await this.cartItemsRepository.findOneBy({
            product: { id: itemId },
            cart: { id: cart.id },
        });

        if (item) {
            item.quantity += 1;
            return item.save();
        }

        return this.cartItemsRepository
            .create({
                product: { id: itemId },
                cart: { id: cart.id },
            })
            .save();
    }

    private async getItemOfCart(
        cart: CartEntity,
        itemId: string,
    ): Promise<CartItemEntity> {
        const item = await this.cartItemsRepository.findOneBy({
            cart: { id: cart.id },
            id: itemId,
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        return item;
    }
}
