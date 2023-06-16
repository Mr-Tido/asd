import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class CartItemsIdsDto {
    @ApiProperty({
        isArray: true,
        description:
            'Перечисление идентификаторов элементов, которые попадут в заказ',
        required: false,
    })
    @IsOptional()
    @IsArray()
    public ids?: string[];
}
