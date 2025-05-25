import { Router } from 'express';
import productRoutes from './product';
import salesRoutes from './sales';

const router = Router();

router.use('/products', productRoutes);
router.use('/sales', salesRoutes);

export default router; 