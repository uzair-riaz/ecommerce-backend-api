import { Request, Response } from 'express';
import { ProductService } from '../services/product';

export class ProductController {
    private productService = new ProductService();

    async getProducts(req: Request, res: Response) {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            lowStock = false,
            search 
        } = req.query;

        const result = await this.productService.getProducts({
            page: Number(page),
            limit: Number(limit),
            category: category as string,
            lowStock: lowStock === 'true',
            search: search as string
        });

        res.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    }

    async createProduct(req: Request, res: Response) {
        const { name, description, price, sku, stock, categoryId } = req.body;

        const savedProduct = await this.productService.createProduct({
            name,
            description,
            price,
            sku,
            stock,
            categoryId
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        });
    }

    async updateInventory(req: Request, res: Response) {
        const { id } = req.params;
        const { changeAmount, reason } = req.body;

        const result = await this.productService.updateInventory(
            Number(id), 
            changeAmount, 
            reason
        );

        res.json({
            success: true,
            message: 'Inventory updated successfully',
            data: result
        });
    }

    async getInventoryStatus(req: Request, res: Response) {
        const { lowStockThreshold = 10 } = req.query;

        const result = await this.productService.getInventoryStatus(Number(lowStockThreshold));

        res.json({
            success: true,
            data: result
        });
    }
} 