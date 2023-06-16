import { DatabaseConfigWorkspace } from '@/config/workspaces/database.workspace';
import { ConfirmationModule } from '@/confirmation/confirmation.module';
import { ConfirmationEntity } from '@/confirmation/confirmation.entity';
import { getConfigurationModule } from '@/config/config.module';
import { ProductsModule } from '@/products/products.module';
import { ProductEntity } from '@/products/product.entity';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtStrategy } from '@/shared/jwt/jwt.strategy';
import { UsersModule } from '@/users/users.module';
import { UserEntity } from '@/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SupportModule } from '@/support/support.module';
import { AuthModule } from '@/auth/auth.module';
import { CartsModule } from '@/carts/carts.module';
import { OrdersModule } from '@/orders/orders.module';
import { CartEntity } from '@/carts/entities/cart.entity';
import { CartItemEntity } from '@/carts/entities/item.entity';
import { OrderEntity } from '@/orders/entities/order.entity';
import { OrderItemEntity } from '@/orders/entities/item.entity';

@Module({
    imports: [
        getConfigurationModule(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(DatabaseConfigWorkspace)],
            inject: [DatabaseConfigWorkspace.KEY],
            useFactory: (
                databaseConfig: ConfigType<typeof DatabaseConfigWorkspace>,
            ) => ({
                type: 'postgres',
                ...databaseConfig,
                extra: {
                    ssl: false,
                },
                ssl: {
                    rejectUnauthorized: false,
                },
                entities: [
                    UserEntity,
                    CartEntity,
                    OrderEntity,
                    ProductEntity,
                    CartItemEntity,
                    OrderItemEntity,
                    ConfirmationEntity,
                ],
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        ConfirmationModule,
        ProductsModule,
        SupportModule,
        OrdersModule,
        CartsModule,
        UsersModule,
        AuthModule,
    ],
    providers: [JwtStrategy],
})
export class AppModule {}
