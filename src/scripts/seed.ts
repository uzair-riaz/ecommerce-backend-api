import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Category } from '../entity/category';
import { InventoryChange } from '../entity/inventory-change';
import { Product } from '../entity/product';
import { Sale } from '../entity/sale';

require('dotenv').config();

async function seedDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully!');

        console.log('Clearing existing data...');
        await AppDataSource.getRepository(Sale).delete({});
        await AppDataSource.getRepository(InventoryChange).delete({});
        await AppDataSource.getRepository(Product).delete({});
        await AppDataSource.getRepository(Category).delete({});

        console.log('Creating categories...');
        const categoryRepository = AppDataSource.getRepository(Category);
        
        const categories = [
            { name: 'Electronics' },
            { name: 'Clothing & Accessories' },
            { name: 'Home & Garden' },
            { name: 'Sports & Outdoors' },
            { name: 'Books & Media' },
            { name: 'Health & Beauty' },
            { name: 'Toys & Games' },
            { name: 'Automotive' },
            { name: 'Grocery & Food' },
            { name: 'Office Supplies' }
        ];

        const savedCategories = await categoryRepository.save(categories);
        console.log(`Created ${savedCategories.length} categories`);

        console.log('Creating products...');
        const productRepository = AppDataSource.getRepository(Product);
        
        const products = [
            {
                name: 'iPhone 15 Pro Max',
                description: 'Latest Apple iPhone with advanced camera system and A17 Pro chip',
                price: 1199.99,
                sku: 'IPHONE-15-PRO-MAX',
                stock: 50,
                category: savedCategories[0]
            },
            {
                name: 'Samsung 65" 4K Smart TV',
                description: 'Ultra HD Smart TV with HDR and built-in streaming apps',
                price: 899.99,
                sku: 'SAMSUNG-TV-65-4K',
                stock: 25,
                category: savedCategories[0]
            },
            {
                name: 'MacBook Air M2',
                description: 'Apple MacBook Air with M2 chip, 13-inch display',
                price: 1299.99,
                sku: 'MACBOOK-AIR-M2',
                stock: 30,
                category: savedCategories[0]
            },
            {
                name: 'Sony WH-1000XM5 Headphones',
                description: 'Wireless noise-canceling headphones with premium sound',
                price: 399.99,
                sku: 'SONY-WH1000XM5',
                stock: 75,
                category: savedCategories[0]
            },
            {
                name: 'Nintendo Switch OLED',
                description: 'Gaming console with vibrant OLED screen',
                price: 349.99,
                sku: 'NINTENDO-SWITCH-OLED',
                stock: 40,
                category: savedCategories[0]
            },
            {
                name: 'Levi\'s 501 Original Jeans',
                description: 'Classic straight-leg jeans in various sizes',
                price: 89.99,
                sku: 'LEVIS-501-JEANS',
                stock: 120,
                category: savedCategories[1]
            },
            {
                name: 'Nike Air Max 270',
                description: 'Comfortable running shoes with Air Max technology',
                price: 149.99,
                sku: 'NIKE-AIRMAX-270',
                stock: 85,
                category: savedCategories[1]
            },
            {
                name: 'Ray-Ban Aviator Sunglasses',
                description: 'Classic aviator sunglasses with UV protection',
                price: 179.99,
                sku: 'RAYBAN-AVIATOR',
                stock: 60,
                category: savedCategories[1]
            },
            {
                name: 'Dyson V15 Detect Vacuum',
                description: 'Cordless vacuum with laser dust detection',
                price: 749.99,
                sku: 'DYSON-V15-DETECT',
                stock: 35,
                category: savedCategories[2]
            },
            {
                name: 'KitchenAid Stand Mixer',
                description: 'Professional 5-quart stand mixer for baking',
                price: 449.99,
                sku: 'KITCHENAID-MIXER-5QT',
                stock: 45,
                category: savedCategories[2]
            },
            {
                name: 'Instant Pot Duo 7-in-1',
                description: 'Multi-functional pressure cooker and slow cooker',
                price: 99.99,
                sku: 'INSTANTPOT-DUO-7IN1',
                stock: 80,
                category: savedCategories[2]
            },
            {
                name: 'Yeti Rambler 30oz Tumbler',
                description: 'Insulated stainless steel tumbler for hot and cold drinks',
                price: 39.99,
                sku: 'YETI-RAMBLER-30OZ',
                stock: 150,
                category: savedCategories[3]
            },
            {
                name: 'Coleman 4-Person Tent',
                description: 'Easy-setup camping tent for family adventures',
                price: 129.99,
                sku: 'COLEMAN-TENT-4P',
                stock: 25,
                category: savedCategories[3]
            },
            {
                name: 'The Seven Husbands of Evelyn Hugo',
                description: 'Bestselling novel by Taylor Jenkins Reid',
                price: 16.99,
                sku: 'BOOK-EVELYN-HUGO',
                stock: 200,
                category: savedCategories[4]
            },
            {
                name: 'Atomic Habits by James Clear',
                description: 'Self-help book about building good habits',
                price: 18.99,
                sku: 'BOOK-ATOMIC-HABITS',
                stock: 180,
                category: savedCategories[4]
            },
            {
                name: 'CeraVe Moisturizing Cream',
                description: 'Daily face and body moisturizer for dry skin',
                price: 19.99,
                sku: 'CERAVE-MOISTURIZER',
                stock: 100,
                category: savedCategories[5]
            },
            {
                name: 'Oral-B Electric Toothbrush',
                description: 'Rechargeable electric toothbrush with timer',
                price: 89.99,
                sku: 'ORALB-ELECTRIC-TB',
                stock: 70,
                category: savedCategories[5]
            },
            {
                name: 'LEGO Creator 3-in-1 Deep Sea Creatures',
                description: 'Building set that creates 3 different sea creatures',
                price: 79.99,
                sku: 'LEGO-DEEPSEA-3IN1',
                stock: 55,
                category: savedCategories[6]
            },
            {
                name: 'Monopoly Classic Board Game',
                description: 'The classic property trading board game',
                price: 24.99,
                sku: 'MONOPOLY-CLASSIC',
                stock: 90,
                category: savedCategories[6]
            },
            {
                name: 'Michelin All-Season Tires (Set of 4)',
                description: 'High-performance all-season tires',
                price: 599.99,
                sku: 'MICHELIN-TIRES-4SET',
                stock: 20,
                category: savedCategories[7]
            },
            {
                name: 'Organic Extra Virgin Olive Oil',
                description: 'Cold-pressed organic olive oil, 500ml bottle',
                price: 24.99,
                sku: 'OLIVE-OIL-ORGANIC',
                stock: 8,
                category: savedCategories[8]
            },
            {
                name: 'Himalayan Pink Salt',
                description: 'Pure Himalayan pink salt, 2lb bag',
                price: 12.99,
                sku: 'HIMALAYAN-SALT-2LB',
                stock: 5,
                category: savedCategories[8]
            }
        ];

        const savedProducts = await productRepository.save(products);
        console.log(`Created ${savedProducts.length} products`);

        console.log('Creating initial inventory changes...');
        const inventoryChangeRepository = AppDataSource.getRepository(InventoryChange);
        
        const inventoryChanges = savedProducts.map(product => ({
            product,
            changeAmount: product.stock,
            reason: 'Initial stock'
        }));

        await inventoryChangeRepository.save(inventoryChanges);
        console.log(`Created ${inventoryChanges.length} inventory change records`);

        console.log('Creating sample sales data...');
        const salesRepository = AppDataSource.getRepository(Sale);
        
        const sales = [];
        const now = new Date();
        
        for (let i = 0; i < 100; i++) {
            const randomProduct = savedProducts[Math.floor(Math.random() * savedProducts.length)];
            const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 items
            const saleDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days
            
            sales.push({
                product: randomProduct,
                quantity,
                totalPrice: randomProduct.price * quantity,
                soldAt: saleDate
            });
        }

        await salesRepository.save(sales);
        console.log(`Created ${sales.length} sample sales`);

        console.log('Updating product stock based on sales...');
        for (const sale of sales) {
            const product = await productRepository.findOne({ where: { id: sale.product.id } });
            if (product) {
                product.stock = Math.max(0, product.stock - sale.quantity);
                await productRepository.save(product);
                
                await inventoryChangeRepository.save({
                    product,
                    changeAmount: -sale.quantity,
                    reason: 'Sale'
                });
            }
        }

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await AppDataSource.destroy();
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();