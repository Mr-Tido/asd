import { UpdateProductDto } from '@/products/dto/update.dto';
import { ProductEntity } from '@/products/product.entity';
import { ProductDto } from '@/products/dto/detailing/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { Between, In, Like, Repository } from 'typeorm';
import { Roles } from 'types/Roles';
import {
    Inject,
    Injectable,
    MethodNotAllowedException,
    NotFoundException,
} from '@nestjs/common';
import { ProductFilterDto } from '@/products/dto/filter.dto';
import { StaticService } from '@/staticfiles/staticfiles.service';
import { OriginsDto } from '@/products/dto/detailing/origins.dto';
import { BrandsDto } from '@/products/dto/detailing/brands.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productsRepository: Repository<ProductEntity>,
        @Inject(StaticService)
        private readonly staticService: StaticService,
    ) {}

    public async createProduct(
        user: UserEntity,
        file: Express.Multer.File,
        productDto: ProductDto,
    ): Promise<ProductEntity> {
        if (user.role !== Roles.ADMIN) {
            throw new MethodNotAllowedException();
        }

        const product = this.productsRepository.create({
            name: productDto.name,
            description: productDto.description,
            price: productDto.price,
            origin: productDto.origin,
            brand: productDto.brand,
            picture: (await this.staticService.uploadFile(file)).path,
        });

        return product.save();
    }

    public async getProduct(id: string): Promise<ProductEntity> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    public async getProducts(
        filterDto?: ProductFilterDto,
    ): Promise<ProductEntity[]> {
        if (!filterDto) {
            return this.productsRepository.find();
        }

        return this.productsRepository.findBy({
            name: filterDto.name ? Like(`%${filterDto.name}%`) : undefined,
            brand: filterDto.brands ? In(filterDto.brands) : undefined,
            origin: filterDto.origins ? In(filterDto.origins) : undefined,
            price: filterDto.price
                ? Between(filterDto.price.lower, filterDto.price.upper)
                : undefined,
        });
    }

    public async updateProduct(
        user: UserEntity,
        id: string,
        updateProductDto: UpdateProductDto,
    ) {
        if (user.role !== Roles.ADMIN) {
            throw new MethodNotAllowedException();
        }

        await this.getProduct(id);

        return this.productsRepository.update({ id }, updateProductDto);
    }

    public async getCountByBrands(): Promise<BrandsDto> {
        return {
            brands: await this.getCountByField('brand'),
            total: await this.productsRepository.count(),
        };
    }

    public async getCountByOrigin(): Promise<OriginsDto> {
        return {
            origins: await this.getCountByField('origin'),
            total: await this.productsRepository.count(),
        };
    }

    public getCountByField(fieldName: string) {
        return this.productsRepository
            .createQueryBuilder('products')
            .select(`products.${fieldName}`, fieldName)
            .addSelect('COUNT(*)', 'count')
            .groupBy(`products.${fieldName}`)
            .getRawMany();
    }

    public async deleteProduct(
        user: UserEntity,
        id: string,
    ): Promise<ProductEntity> {
        if (user.role !== Roles.ADMIN) {
            throw new MethodNotAllowedException();
        }

        const product = await this.getProduct(id);
        return product.remove();
    }
}
