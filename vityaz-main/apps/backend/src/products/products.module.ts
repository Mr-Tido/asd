import { ProductsController } from '@/products/products.controller';
import { StaticModule } from '@/staticfiles/staticfiles.module';
import { ProductsService } from '@/products/products.service';
import { ProductEntity } from '@/products/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

const dynamicTypeOrmModule = TypeOrmModule.forFeature([ProductEntity]);

@Module({
    imports: [dynamicTypeOrmModule, StaticModule],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [dynamicTypeOrmModule, ProductsService],
})
export class ProductsModule {}
