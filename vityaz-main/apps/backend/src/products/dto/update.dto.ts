import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiProperty({ required: false })
    public readonly name?: string;

    @ApiProperty({ required: false })
    public readonly description?: string;

    @ApiProperty({ required: false })
    public readonly price?: number;

    @ApiProperty({ required: false })
    public readonly brand?: string;

    @ApiProperty({ required: false })
    public readonly origin?: string;
}
