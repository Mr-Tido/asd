import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuantityDto {
    @IsInt()
    @IsPositive()
    @ApiProperty({
        name: 'quantity',
        description: 'Новое количество товара в корзине',
        writeOnly: true,
        required: true,
    })
    public quantity: number;
}
