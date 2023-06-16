import { ProductDto } from '@/products/dto/detailing/product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
    @ApiProperty({
        name: 'id',
        description: 'Уникальный идентификатор элемента корзины',
        nullable: false,
        readOnly: true,
    })
    public id: string;

    @ApiProperty({
        name: 'product',
        description: 'Товар, который пользователь покупает',
        type: ProductDto,
        readOnly: true,
    })
    public product: ProductDto;

    @ApiProperty({
        name: 'quantity',
        description: 'Количество конкретно этого товара',
        nullable: false,
        readOnly: true,
    })
    public quantity: number;

    @ApiProperty({
        name: 'price',
        description: 'Цена конкретно этого товара с учетом его количества',
        nullable: false,
        readOnly: true,
    })
    public price: number;
}
