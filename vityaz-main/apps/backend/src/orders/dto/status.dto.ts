import { ApiProperty } from '@nestjs/swagger';
import { Statuses } from '@/orders/Statuses';

export class OrderStatusDto {
    @ApiProperty({
        description: 'Новый статус заказа',
        writeOnly: true,
        nullable: false,
        required: true,
        examples: [Object.values(Statuses)],
    })
    public status: Statuses;
}
