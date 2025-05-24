import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product';

@Entity("sales")
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.sales)
    product: Product;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @CreateDateColumn()
    soldAt: Date;
}
