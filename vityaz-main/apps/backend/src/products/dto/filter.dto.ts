import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ValidateNested,
    IsOptional,
    IsString,
    IsArray,
    IsInt,
    Min,
    Max,
} from 'class-validator';

class ProductFilterPriceDto {
    @ApiProperty({
        required: true,
        writeOnly: true,
        description: 'Верхний барьер цены',
    })
    @Max(1000000)
    @IsInt()
    public readonly upper: number;

    @ApiProperty({
        required: true,
        writeOnly: true,
        description: 'Нижний барьер цены',
    })
    @IsInt()
    @Min(0)
    public readonly lower: number;
}

export class ProductFilterDto {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    public readonly name?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProductFilterPriceDto)
    public readonly price?: ProductFilterPriceDto;

    @ApiProperty({
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public readonly origins?: string[];

    @ApiProperty({
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public readonly brands?: string[];
}
