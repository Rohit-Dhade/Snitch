import ProductModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId, size) => {
    const product = await ProductModel.findOne({
        _id: productId,
        "variant._id": variantId
    })
    if (!product) return 0;
    
    const variant = product.variant.find(v => v._id.toString() === variantId);
    if (!variant) return 0;

    if (size) {
        const sizeObj = variant.sizes.find(s => s.size === size);
        return sizeObj ? sizeObj.stock : 0;
    }

    return variant.sizes.reduce((acc, s) => acc + (s.stock || 0), 0);
}

