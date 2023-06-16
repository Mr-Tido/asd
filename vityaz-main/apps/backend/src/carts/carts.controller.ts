import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { CartEntity } from '@/carts/entities/cart.entity';
import { User } from '@/shared/handlers/user.handler';
import { JwtAuthGuard } from '@/shared/jwt/jwt.guard';
import { CartsService } from '@/carts/carts.service';
import { UserEntity } from '@/users/user.entity';
import { QuantityDto } from './dto/quantity.dto';
import { CartDto } from '@/carts/dto/cart.dto';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiHeader,
    ApiParam,
    ApiBody,
    ApiTags,
} from '@nestjs/swagger';
import {
    UnauthorizedException,
    NotFoundException,
    Controller,
    HttpStatus,
    UseGuards,
    HttpCode,
    Delete,
    Inject,
    Param,
    Patch,
    Body,
    Post,
    Get,
} from '@nestjs/common';

@ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    example: 'Bearer <accessToken>',
    required: true,
})
@ApiException(() => new UnauthorizedException('Invalid access token'), {
    description: 'Пользователь поставил некорректный токен доступа',
})
@ApiTags('Корзина')
@UseGuards(JwtAuthGuard)
@Controller('/cart/')
export class CartsController {
    constructor(
        @Inject(CartsService)
        private readonly cartsService: CartsService,
    ) {}

    @ApiOperation({ summary: 'Получение корзины текущего пользователя' })
    @ApiOkResponse({
        description: 'Пользователь получает объект корзины',
        type: CartDto,
    })
    @Get('/')
    public getCart(@User() client: UserEntity): Promise<CartEntity> {
        return this.cartsService.getCart(client);
    }

    @ApiOkResponse({
        description: 'Пользователь успешно удалил элемент из корзины',
        type: CartDto,
    })
    @ApiParam({
        name: 'itemId',
        description: 'Идентификатор предмета корзины',
    })
    @ApiException(() => new NotFoundException('Cart item not found'), {
        description: 'Элемент корзины с указанным идентификатором не найден',
    })
    @ApiOperation({ summary: 'Удаление элемента из корзины пользователя' })
    @HttpCode(HttpStatus.OK)
    @Delete('/:itemId/')
    public removeItemFromCart(
        @User() client: UserEntity,
        @Param('itemId') itemId: string,
    ): Promise<CartEntity> {
        return this.cartsService.removeItemFromCart(client, itemId);
    }

    @ApiBody({
        type: QuantityDto,
    })
    @ApiParam({
        name: 'itemId',
        description: 'Идентификатор предмета корзины',
    })
    @ApiOkResponse({
        description:
            'Пользователь успешно обновил количество определенного предмета в корзине',
        type: CartDto,
    })
    @ApiException(() => new NotFoundException('Cart item not found'), {
        description: 'Элемент корзины с указанным идентификатором не найден',
    })
    @ApiOperation({
        summary: 'Изменение количества позиции в корзине пользователя',
    })
    @HttpCode(HttpStatus.OK)
    @Patch('/:itemId/')
    public setQuantityOfItem(
        @User() client: UserEntity,
        @Param('itemId') itemId: string,
        @Body() data: QuantityDto,
    ): Promise<CartEntity> {
        return this.cartsService.setQuantityOfItem(
            client,
            itemId,
            data.quantity,
        );
    }

    @ApiParam({
        name: 'productId',
        description: 'Идентификатор товара',
    })
    @ApiCreatedResponse({
        description: 'Пользователь успешно добавил товар в свою корзину',
    })
    @ApiException(() => new NotFoundException('Product not found'), {
        description: 'Продукт с указанным идентификатором не был найден',
    })
    @ApiOperation({ summary: 'Добавление товара в корзину пользователя' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/products/:productId/')
    public addProductToCart(
        @User() client: UserEntity,
        @Param('productId') productId: string,
    ): Promise<void> {
        return this.cartsService.addProductToCart(client, productId);
    }
}
