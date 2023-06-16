import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { CartItemsIdsDto } from '@/orders/dto/cartItemsIds.dto';
import { OrderEntity } from '@/orders/entities/order.entity';
import { OrderStatusDto } from '@/orders/dto/status.dto';
import { OrdersService } from '@/orders/orders.service';
import { User } from '@/shared/handlers/user.handler';
import { JwtAuthGuard } from '@/shared/jwt/jwt.guard';
import { OrderDto } from '@/orders/dto/order.dto';
import { UserEntity } from '@/users/user.entity';
import {
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    Controller,
    HttpStatus,
    UseGuards,
    HttpCode,
    Inject,
    Param,
    Body,
    Post,
    Get,
} from '@nestjs/common';
import {
    ApiNoContentResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiHeader,
    ApiParam,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';

@ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    example: 'Bearer <accessToken>',
    required: true,
})
@ApiException(() => new UnauthorizedException('Invalid access token'), {
    description: 'Пользователь поставил некорректный токен доступа',
})
@ApiTags('Заказы')
@UseGuards(JwtAuthGuard)
@Controller('/orders/')
export class OrdersController {
    constructor(
        @Inject(OrdersService)
        private readonly ordersService: OrdersService,
    ) {}

    @ApiOkResponse({
        description: 'Получение всех заказов текущего пользователя',
        type: OrderDto,
        isArray: true,
    })
    @ApiOperation({ summary: 'Получение всех заказов' })
    @Get('/')
    public getOrders(@User() user: UserEntity): Promise<OrderEntity[]> {
        return this.ordersService.getOrders(user);
    }

    @ApiOkResponse({
        description: 'Получение указанного заказа',
        type: OrderDto,
        isArray: true,
    })
    @ApiException(() => new NotFoundException('Order not found'), {
        description: 'Заказ с указанным идентификатором не был найден',
    })
    @ApiParam({
        name: 'orderId',
        required: true,
        description: 'Идентификатор заказа',
    })
    @ApiOperation({ summary: 'Получение конкретного заказа' })
    @Get('/:orderId/')
    public getOrder(
        @User() user: UserEntity,
        @Param('orderId') id: string,
    ): Promise<OrderEntity> {
        return this.ordersService.getOrder(user, id);
    }

    @ApiBody({
        description: 'Новый статус заказа',
        type: OrderStatusDto,
    })
    @ApiParam({
        name: 'orderId',
        required: true,
        description: 'Идентификатор заказа',
    })
    @ApiNoContentResponse({
        description: 'Статус заказа успешно изменяется',
    })
    @ApiException(() => new NotFoundException('Order not found'), {
        description: 'Заказ с указанным идентификатором не был найден',
    })
    @ApiException(
        () =>
            new ForbiddenException(
                'You dont have enough rights to perform this operation',
            ),
        { description: 'Пользователь не имеет прав выполнять данную операцию' },
    )
    @ApiTags('Для администратора')
    @ApiOperation({ summary: 'Изменение статуса заказа' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/:orderId/')
    public async changeOrderStatus(
        @User() user: UserEntity,
        @Param('orderId') id: string,
        @Body() data: OrderStatusDto,
    ) {
        await this.ordersService.changeOrderStatus(user, id, data);
    }

    @ApiBody({
        description:
            'Перечисление элементов из корзины, которые будут в заказе. ' +
            'Поле может быть пустым - тогда в заказ войдут все предметы из корзины',
        type: CartItemsIdsDto,
    })
    @ApiCreatedResponse({
        description: 'Заказ был успешно создан',
    })
    @ApiOperation({ summary: 'Создание заказа' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    public async createOrder(
        @User() user: UserEntity,
        @Body() data: CartItemsIdsDto,
    ): Promise<void> {
        await this.ordersService.createOrder(user, data);
    }
}
