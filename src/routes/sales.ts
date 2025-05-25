import { Router } from 'express';
import { SalesController } from '../controllers/sales';
import { validate, validateQuery } from '../middleware/validation';
import {
    revenueAnalyticsQuerySchema,
    saleSchema,
    salesComparisonQuerySchema,
    salesQuerySchema
} from '../schemas/sales';

const router = Router();
const salesController = new SalesController();

// GET /api/v1/sales - Get all sales with filtering and pagination
router.get('/', 
    validateQuery(salesQuerySchema),
    salesController.getSales.bind(salesController)
);

// GET /api/v1/sales/analytics/revenue - Get revenue analytics
router.get('/analytics/revenue', 
    validateQuery(revenueAnalyticsQuerySchema),
    salesController.getRevenueAnalytics.bind(salesController)
);

// GET /api/v1/sales/analytics/category - Get sales by category
router.get('/analytics/category', 
    validateQuery(salesQuerySchema),
    salesController.getSalesByCategory.bind(salesController)
);

// GET /api/v1/sales/analytics/comparison - Get sales comparison between periods
router.get('/analytics/comparison', 
    validateQuery(salesComparisonQuerySchema),
    salesController.getSalesComparison.bind(salesController)
);

// POST /api/v1/sales - Create new sale
router.post('/', 
    validate(saleSchema),
    salesController.createSale.bind(salesController)
);

export default router; 