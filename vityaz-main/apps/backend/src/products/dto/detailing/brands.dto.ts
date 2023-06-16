import { ApiProperty } from '@nestjs/swagger';

export class BrandsDto {
    @ApiProperty({ isArray: true, readOnly: true })
    public brands: BrandDto[];

    @ApiProperty({ readOnly: true })
    public total: number;
}

export class BrandDto {
    @ApiProperty({ readOnly: true })
    public brand: string;

    @ApiProperty({ readOnly: true })
    public count: number;
}
