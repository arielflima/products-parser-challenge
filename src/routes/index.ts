import { Router } from 'express';
import productRoutes from './productRoutes';
import apiRoutes from './apiRoutes';
import { apiKeyAuth } from '../middlewares/authorization/apiKeyAuth';

const router = Router();

router.use(apiKeyAuth);
router.use('/', apiRoutes);
router.use('/products', productRoutes);

export default router;
