import { OrderItemEntity } from '@/orders/entities/item.entity';
import { CartItemsIdsDto } from '@/orders/dto/cartItemsIds.dto';
import { CartItemEntity } from '@/carts/entities/item.entity';
import { OrderEntity } from '@/orders/entities/order.entity';
import { OrderStatusDto } from '@/orders/dto/status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { In, Not, Repository } from 'typeorm';
import { Statuses } from '@/orders/Statuses';
import { Roles } from 'types/Roles';
import {
    MethodNotAllowedException,
    ForbiddenException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderItemEntity)
        private readonly orderItemsRepository: Repository<OrderItemEntity>,
        @InjectRepository(OrderEntity)
        private readonly ordersRepository: Repository<OrderEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemsRepository: Repository<CartItemEntity>,
    ) {}

    public getOrders(user: UserEntity) {
        if (user.role === Roles.ADMIN) {
            return this.ordersRepository.findBy({
                status: Not(Statuses.Rejected),
            });
        }
        return this.ordersRepository.findBy({
            client: { id: user.id },
        });
    }

    public async getOrder(
        user: UserEntity,
        orderId: string,
    ): Promise<OrderEntity> {
        let order: OrderEntity | null;
        if (user.role === Roles.ADMIN) {
            order = await this.ordersRepository.findOneBy({ id: orderId });
        } else {
            order = await this.ordersRepository.findOneBy({
                client: { id: user.id },
                id: orderId,
            });
        }

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    public async createOrder(
        user: UserEntity,
        data: CartItemsIdsDto,
    ): Promise<OrderEntity> {
        if (user.role === Roles.ADMIN) {
            throw new MethodNotAllowedException();
        }

        const order = this.ordersRepository.create({
            status: Statuses.Created,
            client: { id: user.id },
            items: await this.transformItems(
                await this.getCartItemsByIds(user, data.ids),
            ),
        });

        return order.save();
    }

    private async transformItems(
        items: CartItemEntity[],
    ): Promise<OrderItemEntity[]> {
        const result: OrderItemEntity[] = [];
        for (const item of items) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { cart, id, ...generalData } = item;
            result.push(
                await this.orderItemsRepository.create(generalData).save(),
            );
            await item.remove();
        }
        return result;
    }

    private getCartItemsByIds(
        user: UserEntity,
        itemsIds?: string[],
    ): Promise<CartItemEntity[]> {
        return this.cartItemsRepository.findBy({
            cart: { client: { id: user.id } },
            id: itemsIds && itemsIds.length !== 0 ? In(itemsIds) : undefined,
        });
    }

    public async changeOrderStatus(
        user: UserEntity,
        orderId: string,
        data: OrderStatusDto,
    ): Promise<OrderEntity> {
        if (user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                'You dont have enough rights to perform this operation',
            );
        }

        const order = await this.ordersRepository.findOneBy({ id: orderId });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = data.status;
        return order.save();
    }
}
