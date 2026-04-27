import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { CreateProductController, GetSellerProductController, GetAllProductController ,GetProductByIdController ,AddVariantController } from "../controller/Product.controller.js";
import multer from "multer";
import { validateCreateProduct } from "../validators/product.validator.js";

const ProductRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 7 * 1024 * 1024,
    },
})

ProductRouter.post('/create-product', authenticateSeller, upload.array('images', 7), validateCreateProduct, CreateProductController);

ProductRouter.post('/add-variant/:productId', authenticateSeller, upload.array('images', 7), AddVariantController);

ProductRouter.get('/get-product/seller', authenticateSeller, GetSellerProductController);

ProductRouter.get('/get-all-product', GetAllProductController);

ProductRouter.get('/get-product/:id', GetProductByIdController);

export default ProductRouter;