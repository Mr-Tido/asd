import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('varchar', { nullable: false })
    public name: string;

    @Column('varchar', { nullable: true })
    public description: string | null;

    @Column('decimal', {
        nullable: false,
        default: 0,
        transformer: {
            from: (value) => parseFloat(value),
            to: (value) => value,
        },
    })
    public price: number;

    @Column('varchar', { nullable: false })
    public brand: string;

    @Column('varchar', { nullable: false })
    public origin: string;

    @Column('varchar', { nullable: false })
    public picture: string;
}
