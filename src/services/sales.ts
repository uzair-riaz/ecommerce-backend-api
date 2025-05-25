import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
import { Sale } from '../entity/sale';
import {
    InsufficientStockError,
    ProductNotFoundError
} from '../errors';
import { ProductService } from './product';

export class SalesService {
    private salesRepository = AppDataSource.getRepository(Sale);
    private productRepository = AppDataSource.getRepository(Product);
    private productService = new ProductService();

    async getSales(filters: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        productId?: string;
        categoryId?: string;
    }) {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            productId,
            categoryId
        } = filters;

        const queryBuilder = this.salesRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.product', 'product')
            .leftJoinAndSelect('product.category', 'category');

        // Date range filter
        if (startDate && endDate) {
            queryBuilder.andWhere('sale.soldAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });
        } else if (startDate) {
            queryBuilder.andWhere('sale.soldAt >= :startDate', {
                startDate: new Date(startDate)
            });
        } else if (endDate) {
            queryBuilder.andWhere('sale.soldAt <= :endDate', {
                endDate: new Date(endDate)
            });
        }

        // Product filter
        if (productId) {
            queryBuilder.andWhere('product.id = :productId', { productId });
        }

        // Category filter
        if (categoryId) {
            queryBuilder.andWhere('category.id = :categoryId', { categoryId });
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        queryBuilder.skip(skip).take(Number(limit));

        // Order by sale date
        queryBuilder.orderBy('sale.soldAt', 'DESC');

        const [sales, total] = await queryBuilder.getManyAndCount();

        return {
            sales,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async createSale(saleData: { productId: number; quantity: number }) {
        const { productId, quantity } = saleData;

        const product = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        if (product.stock < quantity) {
            throw new InsufficientStockError(product.stock, quantity, product.name);
        }

        const totalPrice = product.price * quantity;

        // Create sale
        const sale = new Sale();
        sale.product = product;
        sale.quantity = quantity;
        sale.totalPrice = totalPrice;

        const savedSale = await this.salesRepository.save(sale);

        // Update product stock using ProductService
        await this.productService.reduceStock(productId, quantity, 'Sale');

        return savedSale;
    }

    async getRevenueAnalytics(filters: {
        period?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const { period = 'daily', startDate, endDate } = filters;

        let dateFormat: string;
        let groupBy: string;

        switch (period) {
            case 'daily':
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(sale.soldAt)';
                break;
            case 'weekly':
                dateFormat = '%Y-%u';
                groupBy = 'YEARWEEK(sale.soldAt)';
                break;
            case 'monthly':
                dateFormat = '%Y-%m';
                groupBy = 'DATE_FORMAT(sale.soldAt, "%Y-%m")';
                break;
            case 'annual':
                dateFormat = '%Y';
                groupBy = 'YEAR(sale.soldAt)';
                break;
            default:
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(sale.soldAt)';
        }

        const queryBuilder = this.salesRepository
            .createQueryBuilder('sale')
            .select([
                `${groupBy} as period`,
                'SUM(sale.totalPrice) as revenue',
                'SUM(sale.quantity) as totalQuantity',
                'COUNT(sale.id) as totalSales'
            ])
            .groupBy(groupBy)
            .orderBy('period', 'DESC');

        // Date range filter
        if (startDate && endDate) {
            queryBuilder.andWhere('sale.soldAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });
        }

        const results = await queryBuilder.getRawMany();

        // Calculate totals
        const totalRevenue = results.reduce((sum, item) => sum + parseFloat(item.revenue), 0);
        const totalQuantity = results.reduce((sum, item) => sum + parseInt(item.totalQuantity), 0);
        const totalSales = results.reduce((sum, item) => sum + parseInt(item.totalSales), 0);

        return {
            period,
            analytics: results,
            summary: {
                totalRevenue,
                totalQuantity,
                totalSales,
                averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
            }
        };
    }

    async getSalesByCategory(filters: { startDate?: string; endDate?: string }) {
        const { startDate, endDate } = filters;

        const queryBuilder = this.salesRepository
            .createQueryBuilder('sale')
            .leftJoin('sale.product', 'product')
            .leftJoin('product.category', 'category')
            .select([
                'category.id as categoryId',
                'category.name as categoryName',
                'SUM(sale.totalPrice) as revenue',
                'SUM(sale.quantity) as totalQuantity',
                'COUNT(sale.id) as totalSales'
            ])
            .groupBy('category.id, category.name')
            .orderBy('revenue', 'DESC');

        // Date range filter
        if (startDate && endDate) {
            queryBuilder.andWhere('sale.soldAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });
        }

        return await queryBuilder.getRawMany();
    }

    async getSalesComparison(comparisonData: {
        currentStartDate: string;
        currentEndDate: string;
        previousStartDate: string;
        previousEndDate: string;
    }) {
        const { 
            currentStartDate, 
            currentEndDate, 
            previousStartDate, 
            previousEndDate 
        } = comparisonData;

        // Current period sales
        const currentSales = await this.salesRepository
            .createQueryBuilder('sale')
            .select([
                'SUM(sale.totalPrice) as revenue',
                'SUM(sale.quantity) as totalQuantity',
                'COUNT(sale.id) as totalSales'
            ])
            .where('sale.soldAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(currentStartDate),
                endDate: new Date(currentEndDate)
            })
            .getRawOne();

        // Previous period sales
        const previousSales = await this.salesRepository
            .createQueryBuilder('sale')
            .select([
                'SUM(sale.totalPrice) as revenue',
                'SUM(sale.quantity) as totalQuantity',
                'COUNT(sale.id) as totalSales'
            ])
            .where('sale.soldAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(previousStartDate),
                endDate: new Date(previousEndDate)
            })
            .getRawOne();

        // Calculate percentage changes
        const revenueChange = previousSales.revenue > 0 
            ? ((currentSales.revenue - previousSales.revenue) / previousSales.revenue) * 100 
            : 0;

        const quantityChange = previousSales.totalQuantity > 0 
            ? ((currentSales.totalQuantity - previousSales.totalQuantity) / previousSales.totalQuantity) * 100 
            : 0;

        const salesChange = previousSales.totalSales > 0 
            ? ((currentSales.totalSales - previousSales.totalSales) / previousSales.totalSales) * 100 
            : 0;

        return {
            currentPeriod: {
                startDate: currentStartDate,
                endDate: currentEndDate,
                revenue: parseFloat(currentSales.revenue) || 0,
                totalQuantity: parseInt(currentSales.totalQuantity) || 0,
                totalSales: parseInt(currentSales.totalSales) || 0
            },
            previousPeriod: {
                startDate: previousStartDate,
                endDate: previousEndDate,
                revenue: parseFloat(previousSales.revenue) || 0,
                totalQuantity: parseInt(previousSales.totalQuantity) || 0,
                totalSales: parseInt(previousSales.totalSales) || 0
            },
            comparison: {
                revenueChange: parseFloat(revenueChange.toFixed(2)),
                quantityChange: parseFloat(quantityChange.toFixed(2)),
                salesChange: parseFloat(salesChange.toFixed(2))
            }
        };
    }
} 