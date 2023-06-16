import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
    @ApiProperty({
        required: true,
        readOnly: true,
    })
    public id: string;

    @IsString()
    @ApiProperty({ required: true })
    public name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, type: String })
    public description: string | null;

    @IsNumber()
    @ApiProperty({ required: true })
    public price: number;

    @IsString()
    @ApiProperty({ required: true })
    public brand: string;

    @IsString()
    @ApiProperty({ required: true })
    public origin: string;

    @ApiProperty({ required: true, readOnly: true })
    public picture: string;
}
