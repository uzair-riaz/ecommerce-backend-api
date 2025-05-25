import { Request, Response } from 'express';
import { ApiError } from '../errors';
import { SalesService } from '../services/sales';

export class SalesController {
    private salesService = new SalesService();

    async getSales(req: Request, res: Response) {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            productId,
            categoryId
        } = req.query;

        const result = await this.salesService.getSales({
            page: Number(page),
            limit: Number(limit),
            startDate: startDate as string,
            endDate: endDate as string,
            productId: productId as string,
            categoryId: categoryId as string
        });

        res.json({
            success: true,
            data: result.sales,
            pagination: result.pagination
        });
    }

    async createSale(req: Request, res: Response) {
        const { productId, quantity } = req.body;

        const savedSale = await this.salesService.createSale({
            productId,
            quantity
        });

        res.status(201).json({
            success: true,
            message: 'Sale created successfully',
            data: savedSale
        });
    }

    async getRevenueAnalytics(req: Request, res: Response) {
        const { period = 'daily', startDate, endDate } = req.query;

        const result = await this.salesService.getRevenueAnalytics({
            period: period as string,
            startDate: startDate as string,
            endDate: endDate as string
        });

        res.json({
            success: true,
            data: result
        });
    }

    async getSalesByCategory(req: Request, res: Response) {
        const { startDate, endDate } = req.query;

        const results = await this.salesService.getSalesByCategory({
            startDate: startDate as string,
            endDate: endDate as string
        });

        res.json({
            success: true,
            data: results
        });
    }

    async getSalesComparison(req: Request, res: Response) {
        const { 
            currentStartDate, 
            currentEndDate, 
            previousStartDate, 
            previousEndDate 
        } = req.query;

        if (!currentStartDate || !currentEndDate || !previousStartDate || !previousEndDate) {
            throw new ApiError('All date parameters are required for comparison', 400);
        }

        const result = await this.salesService.getSalesComparison({
            currentStartDate: currentStartDate as string,
            currentEndDate: currentEndDate as string,
            previousStartDate: previousStartDate as string,
            previousEndDate: previousEndDate as string
        });

        res.json({
            success: true,
            data: result
        });
    }
} 