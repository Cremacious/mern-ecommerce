import express from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('featured', protectRoute, adminRoute, getFeaturedProducts);
router.post('/', protectRoute, adminRoute, createProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;
