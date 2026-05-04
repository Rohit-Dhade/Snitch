import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { AddToCartController, viewCartController, removeCartItemController, updateCartItemController } from '../controller/cart.controller.js';
import ValidateAddToCart, { ValidateUpdateCartQuantity } from '../validators/cart.validator.js';

const router = express.Router();

router.post('/add/:productId', authenticateUser, ValidateAddToCart, AddToCartController);
router.get('/view', authenticateUser, viewCartController);
router.delete('/remove/:itemId', authenticateUser, removeCartItemController);
router.put('/update/:itemId', authenticateUser, ValidateUpdateCartQuantity, updateCartItemController);

export default router;