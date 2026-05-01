import expressValidator from 'express-validator';
const validateRequest = (req,res,next) => {
    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

const ValidateAddToCart = [
    
    expressValidator.param("productId").notEmpty().withMessage("Product ID is required"),
    expressValidator.body("variant").notEmpty().withMessage("Variant is required"),
    expressValidator.body("quantity").notEmpty().withMessage("Quantity is required"),
    expressValidator.body("price").notEmpty().withMessage("Price is required"),
    validateRequest,
]

export default ValidateAddToCart