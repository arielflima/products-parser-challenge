import { Router } from 'express';
import {
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../products/controllers/ProductController';

const router = Router();

// GET
router.get('/search', searchProducts);
router.get('/:code', getProduct);
router.get('/', getProducts);

// PUT
router.put('/:code', updateProduct);

// DELETE
router.delete('/:code', deleteProduct);

export default router;
