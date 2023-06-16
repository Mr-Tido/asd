import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ProductsService } from '@/products/products.service';
import { CreateProductDto } from '@/products/dto/create.dto';
import { ProductFilterDto } from '@/products/dto/filter.dto';
import { UpdateProductDto } from '@/products/dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductEntity } from '@/products/product.entity';
import { ProductDto } from '@/products/dto/detailing/product.dto';
import { OriginsDto } from '@/products/dto/detailing/origins.dto';
import { User } from '@/shared/handlers/user.handler';
import { JwtAuthGuard } from '@/shared/jwt/jwt.guard';
import { BrandsDto } from '@/products/dto/detailing/brands.dto';
import { UserEntity } from '@/users/user.entity';
import {
    UnauthorizedException,
    NotFoundException,
    UseInterceptors,
    ValidationPipe,
    UploadedFile,
    HttpStatus,
    Controller,
    UseGuards,
    HttpCode,
    Inject,
    Delete,
    Param,
    Patch,
    Body,
    Post,
    Get,
} from '@nestjs/common';
import {
    ApiMethodNotAllowedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiConsumes,
    ApiHeader,
    ApiBody,
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Товары')
@Controller('/products/')
export class ProductsController {
    constructor(
        @Inject(ProductsService)
        private readonly productsService: ProductsService,
    ) {}

    @ApiOperation({ summary: 'Получение брендов и их количества' })
    @ApiOkResponse({ type: BrandsDto })
    @HttpCode(HttpStatus.OK)
    @Get('brands')
    public getBrands(): Promise<BrandsDto> {
        return this.productsService.getCountByBrands();
    }

    @ApiOperation({ summary: 'Получение стран производителей и их количества' })
    @ApiOkResponse({ type: OriginsDto })
    @HttpCode(HttpStatus.OK)
    @Get('/origins/')
    public getOrigins(): Promise<OriginsDto> {
        return this.productsService.getCountByOrigin();
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateProductDto })
    @ApiOkResponse({ type: ProductDto, description: 'Товар успешно создан' })
    @ApiMethodNotAllowedResponse({
        description: 'У пользователя недостаточно прав',
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer access token',
        example: 'Bearer <accessToken>',
        required: true,
    })
    @ApiException(() => new UnauthorizedException('Invalid access token'), {
        description: 'Пользователь поставил некорректный токен доступа',
    })
    @ApiTags('Для администратора')
    @ApiOperation({ summary: 'Создание товара (Admin Only)' })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    public createProduct(
        @User() user: UserEntity,
        @UploadedFile() file: Express.Multer.File,
        @Body() createProductDto: ProductDto,
    ): Promise<ProductEntity> {
        return this.productsService.createProduct(user, file, createProductDto);
    }

    @ApiBody({ type: ProductFilterDto, required: false })
    @ApiOkResponse({ type: ProductDto, isArray: true })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Получение всех товаров',
        description: 'Фильтрация не обязательна',
    })
    @Post('/filter/')
    public getProducts(
        @Body() productFilterDto?: ProductFilterDto,
    ): Promise<ProductEntity[]> {
        return this.productsService.getProducts(productFilterDto);
    }

    @ApiException(() => new NotFoundException('Product not found'), {
        description: 'Товар не был найден',
    })
    @ApiOperation({
        summary: 'Получение определенного товара',
    })
    @ApiOkResponse({ type: ProductDto })
    @HttpCode(HttpStatus.OK)
    @Get('/:productId/')
    public getProduct(
        @Param('productId') productId: string,
    ): Promise<ProductEntity> {
        return this.productsService.getProduct(productId);
    }

    @ApiMethodNotAllowedResponse({
        description: 'У пользователя недостаточно прав',
    })
    @ApiException(() => new NotFoundException('Product not found'), {
        description: 'Товар не был найден',
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer access token',
        example: 'Bearer <accessToken>',
        required: true,
    })
    @ApiException(() => new UnauthorizedException('Invalid access token'), {
        description: 'Пользователь поставил некорректный токен доступа',
    })
    @ApiTags('Для администратора')
    @ApiOperation({ summary: 'Обновление товара (Admin Only)' })
    @ApiNoContentResponse({ description: 'Товар успешно обновлен' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/:productId/')
    public async updateProduct(
        @User() user: UserEntity,
        @Param('productId') productId: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<void> {
        await this.productsService.updateProduct(
            user,
            productId,
            updateProductDto,
        );
    }

    @ApiMethodNotAllowedResponse({
        description: 'У пользователя недостаточно прав',
    })
    @ApiException(() => new NotFoundException('Product not found'), {
        description: 'Товар не был найден',
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer access token',
        example: 'Bearer <accessToken>',
        required: true,
    })
    @ApiException(() => new UnauthorizedException('Invalid access token'), {
        description: 'Пользователь поставил некорректный токен доступа',
    })
    @ApiTags('Для администратора')
    @ApiOperation({ summary: 'Удаление товара (Admin Only)' })
    @ApiNoContentResponse({ description: 'Товар успешно удален' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:productId/')
    public deleteProduct(
        @User() user: UserEntity,
        @Param('productId') productId: string,
    ): Promise<ProductEntity> {
        return this.productsService.deleteProduct(user, productId);
    }
}
