import ProductModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId, size) => {
    let query = { _id: productId };
    if (variantId) {
        query["variant._id"] = variantId;
    }

    const product = await ProductModel.findOne(query);
    if (!product) return 0;
    
    if (variantId) {
        const variant = product.variant.find(v => v._id.toString() === variantId);
        if (variant) {
            if (size) {
                const sizeObj = variant.sizes.find(s => s.size === size);
                return sizeObj ? sizeObj.stock : 0;
            }
            return variant.sizes.reduce((acc, s) => acc + (s.stock || 0), 0);
        }
    }

    // Fallback to base product sizes if no variant is specified or found
    if (product.size && product.size.length > 0) {
        if (size) {
            const sizeObj = product.size.find(s => s.size === size);
            return sizeObj ? sizeObj.stock : 0;
        }
        return product.size.reduce((acc, s) => acc + (s.stock || 0), 0);
    }

    return 0;
}
