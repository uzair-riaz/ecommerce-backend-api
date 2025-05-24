import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category';
import { Sale } from './sale';
import { InventoryChange } from './inventory-change';

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    sku: string;

    @Column()
    stock: number;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @OneToMany(() => Sale, sale => sale.product)
    sales: Sale[];

    @OneToMany(() => InventoryChange, change => change.product)
    inventoryChanges: InventoryChange[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
