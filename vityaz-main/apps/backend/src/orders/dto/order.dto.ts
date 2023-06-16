import { OrderItemDto } from '@/orders/dto/item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @ApiProperty({
        name: 'id',
        description: 'Уникальный идентификатор заказа пользователя',
        nullable: false,
        readOnly: true,
    })
    public id: string;

    @ApiProperty({
        name: 'items',
        description: 'Элементы заказа',
        nullable: false,
        readOnly: true,
        isArray: true,
        type: OrderItemDto,
    })
    public items: OrderItemDto[];

    @ApiProperty({
        name: 'totalPrice',
        description: 'Общая стоимость товаров в заказе',
        nullable: false,
        readOnly: true,
    })
    public totalPrice: number;
}
