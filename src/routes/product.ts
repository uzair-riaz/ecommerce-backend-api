import { Router } from 'express';
import { ProductController } from '../controllers/product';
import { validate, validateParams, validateQuery } from '../middleware/validation';
import { idParamSchema } from '../schemas/common';
import {
    inventoryUpdateSchema,
    productQuerySchema,
    productSchema
} from '../schemas/product';

const router = Router();
const productController = new ProductController();

router.get('/',
    validateQuery(productQuerySchema),
    productController.getProducts.bind(productController)
);

router.get('/inventory',
    productController.getInventoryStatus.bind(productController)
);

router.post('/',
    validate(productSchema),
    productController.createProduct.bind(productController)
);

router.patch('/:id/inventory',
    validateParams(idParamSchema),
    validate(inventoryUpdateSchema),
    productController.updateInventory.bind(productController)
);

export default router; 