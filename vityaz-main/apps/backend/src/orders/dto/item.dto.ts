import { ProductDto } from '@/products/dto/detailing/product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({
        description: 'Идентификатор элемента',
        readOnly: true,
    })
    public id: string;

    @ApiProperty({
        description: 'Товар',
        readOnly: true,
        required: false,
    })
    public product: ProductDto;

    @ApiProperty({
        description: 'Количество товара',
        readOnly: true,
    })
    public quantity: number;

    @ApiProperty({
        description: 'Цена позиции',
        readOnly: true,
    })
    public price: number;
}
