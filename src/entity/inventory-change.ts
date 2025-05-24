import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product';

@Entity("inventory_changes")
export class InventoryChange {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.inventoryChanges)
    product: Product;

    @Column()
    changeAmount: number;

    @Column({ nullable: true })
    reason: string;

    @CreateDateColumn()
    changedAt: Date;
}
