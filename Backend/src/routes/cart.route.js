import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { AddToCartController, viewCartController } from '../controller/cart.controller.js';
import ValidateAddToCart from '../validators/cart.validator.js';

const router = express.Router();

router.post('/add/:productId', authenticateUser, ValidateAddToCart, AddToCartController);
router.get('/view', authenticateUser, viewCartController);
// router.delete('/remove/:itemId', authenticateUser, removeCartItemController);

export default router;