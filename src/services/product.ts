import { AppDataSource } from '../data-source';
import { Category } from '../entity/category';
import { InventoryChange } from '../entity/inventory-change';
import { Product } from '../entity/product';
import {
    CategoryNotFoundError,
    DuplicateSkuError,
    InsufficientStockError,
    ProductNotFoundError
} from '../errors';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);
    private categoryRepository = AppDataSource.getRepository(Category);
    private inventoryChangeRepository = AppDataSource.getRepository(InventoryChange);

    async getProducts(filters: {
        page?: number;
        limit?: number;
        category?: string;
        lowStock?: boolean;
        search?: string;
        lowStockThreshold?: number;
    }) {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            lowStock = false,
            search,
            lowStockThreshold = 10
        } = filters;

        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.sales', 'sales')
            .leftJoinAndSelect('product.inventoryChanges', 'inventoryChanges');

        if (category) {
            queryBuilder.andWhere('category.id = :categoryId', { categoryId: category });
        }

        if (lowStock) {
            queryBuilder.andWhere('product.stock < :lowStockThreshold', { lowStockThreshold });
        }

        if (search) {
            queryBuilder.andWhere(
                '(product.name LIKE :search OR product.sku LIKE :search)',
                { search: `%${search}%` }
            );
        }

        const skip = (Number(page) - 1) * Number(limit);
        queryBuilder.skip(skip).take(Number(limit));

        queryBuilder.orderBy('product.createdAt', 'DESC');

        const [products, total] = await queryBuilder.getManyAndCount();

        return {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async createProduct(productData: {
        name: string;
        description?: string;
        price: number;
        sku: string;
        stock: number;
        categoryId: number;
    }) {
        const { name, description, price, sku, stock, categoryId } = productData;

        const existingProduct = await this.productRepository.findOne({
            where: { sku }
        });

        if (existingProduct) {
            throw new DuplicateSkuError(sku);
        }

        const category = await this.categoryRepository.findOne({
            where: { id: categoryId }
        });

        if (!category) {
            throw new CategoryNotFoundError(categoryId);
        }

        const product = new Product();
        product.name = name;
        product.description = description;
        product.price = price;
        product.sku = sku;
        product.stock = stock;
        product.category = category;

        const savedProduct = await this.productRepository.save(product);

        await this.createInventoryChange(savedProduct, stock, 'Initial stock');

        return savedProduct;
    }

    async updateInventory(id: number, changeAmount: number, reason?: string) {
        const product = await this.productRepository.findOne({
            where: { id }
        });

        if (!product) {
            throw new ProductNotFoundError(id);
        }

        const newStock = product.stock + changeAmount;
        
        if (newStock < 0) {
            throw new InsufficientStockError(product.stock, Math.abs(changeAmount), product.name);
        }

        const previousStock = product.stock;

        product.stock = newStock;
        await this.productRepository.save(product);

        await this.createInventoryChange(product, changeAmount, reason || 'Manual adjustment');

        return {
            productId: product.id,
            previousStock,
            newStock: product.stock,
            changeAmount,
            reason: reason || 'Manual adjustment'
        };
    }

    async getInventoryStatus(lowStockThreshold: number = 10) {
        const products = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .select([
                'product.id',
                'product.name',
                'product.sku',
                'product.stock',
                'product.price',
                'category.name'
            ])
            .orderBy('product.stock', 'ASC')
            .getMany();

        const lowStockProducts = products.filter(
            product => product.stock < lowStockThreshold
        );

        const totalValue = products.reduce(
            (sum, product) => sum + (product.stock * product.price), 0
        );

        return {
            totalProducts: products.length,
            lowStockProducts: lowStockProducts.length,
            lowStockThreshold,
            totalInventoryValue: totalValue,
            products,
            lowStockAlerts: lowStockProducts
        };
    }

    async reduceStock(productId: number, quantity: number, reason: string = 'Sale') {
        const product = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        if (product.stock < quantity) {
            throw new InsufficientStockError(product.stock, quantity, product.name);
        }

        product.stock -= quantity;
        await this.productRepository.save(product);

        await this.createInventoryChange(product, -quantity, reason);

        return product;
    }

    private async createInventoryChange(product: Product, changeAmount: number, reason: string) {
        const inventoryChange = new InventoryChange();
        inventoryChange.product = product;
        inventoryChange.changeAmount = changeAmount;
        inventoryChange.reason = reason;

        return await this.inventoryChangeRepository.save(inventoryChange);
    }
} 