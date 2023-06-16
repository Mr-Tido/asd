import { CartItemEntity } from '@/carts/entities/item.entity';
import { ProductsModule } from '@/products/products.module';
import { CartsController } from '@/carts/carts.controller';
import { CartEntity } from '@/carts/entities/cart.entity';
import { CartsService } from '@/carts/carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

const cardsTypeormModule = TypeOrmModule.forFeature([
    CartItemEntity,
    CartEntity,
]);

@Module({
    imports: [cardsTypeormModule, ProductsModule],
    providers: [CartsService],
    controllers: [CartsController],
    exports: [cardsTypeormModule, CartsService],
})
export class CartsModule {}
