import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { CreateProductController } from "../controller/Product.controller.js";
import multer from "multer";

const ProductRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 7 * 1024 * 1024,
    },
})

ProductRouter.post('/create-product', authenticateSeller, upload.array('images', 7), CreateProductController);



export default ProductRouter;