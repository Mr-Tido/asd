import { CartItemDto } from '@/carts/dto/item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
    @ApiProperty({
        name: 'id',
        description: 'Уникальный идентификатор корзины пользователя',
        nullable: false,
        readOnly: true,
    })
    public id: string;

    @ApiProperty({
        name: 'items',
        description: 'Элементы корзины',
        nullable: false,
        readOnly: true,
        isArray: true,
        type: CartItemDto,
    })
    public items: CartItemDto[];

    @ApiProperty({
        name: 'totalPrice',
        description: 'Общая стоимость товаров в корзине',
        nullable: false,
        readOnly: true,
    })
    public totalPrice: number;
}
