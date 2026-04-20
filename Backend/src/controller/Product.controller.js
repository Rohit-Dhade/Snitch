import ProductModel from "../models/product.model.js";

export const CreateProductController = async (req, res) => {
    try {
        const { title, price, description, image } = req.body;
        const product = await ProductModel.create({
            title,
            price,
            description,
            image,
            seller: req.user._id
        })
        return res.status(201).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};