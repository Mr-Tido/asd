import { ProductDto } from '@/products/dto/detailing/product.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateProductDto extends OmitType(ProductDto, [
    'id',
    'picture',
] as const) {
    @ApiProperty({ required: true, writeOnly: true })
    public readonly file: Express.Multer.File;
}
