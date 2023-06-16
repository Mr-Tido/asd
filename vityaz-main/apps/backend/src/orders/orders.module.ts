import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/orders/entities/order.entity';
import { OrderItemEntity } from '@/orders/entities/item.entity';
import { OrdersController } from '@/orders/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { CartsModule } from '@/carts/carts.module';

const dynamicTypeormModule = TypeOrmModule.forFeature([
    OrderEntity,
    OrderItemEntity,
]);

@Module({
    imports: [dynamicTypeormModule, CartsModule],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [dynamicTypeormModule],
})
export class OrdersModule {}
