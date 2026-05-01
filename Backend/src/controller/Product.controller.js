import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.services.js";

export const CreateProductController = async (req, res) => {

    const { title, description, priceAmount, priceCurrency, color } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
        })
    }))

    const product = await ProductModel.create({
        title,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        description,
        color: color,
        images,
        seller: seller._id
    })

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
};


export const GetSellerProductController = async (req, res) => {
    const seller = req.user;

    const products = await ProductModel.find({ seller: seller._id });

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
    });
};

export const GetAllProductController = async (req, res) => {
    const products = await ProductModel.find();

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
    });
};

export const GetProductByIdController = async (req, res) => {
    const { id } = req.params;

    // .lean() converts Mongoose documents (including Map fields like `attributes`)
    // into plain JS objects so they serialize correctly as JSON.
    const product = await ProductModel.findById(id).lean();

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
    });
};

export const AddVariantController = async (req, res) => {
    try {
        const { productId, color, colorHex, sizes, priceCurrency } = req.body;

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!color || !color.trim()) {
            return res.status(400).json({ success: false, message: "Color name is required" });
        }

        // sizes is a JSON string: [{ size: "M", stock: 10, priceAmount: 999 }, ...]
        let parsedSizes = [];
        if (sizes) {
            parsedSizes = JSON.parse(sizes).map(s => ({
                size: s.size,
                stock: Number(s.stock) || 0,
                price: {
                    amount: Number(s.priceAmount),
                    currency: priceCurrency || 'INR',
                },
            }));
        }

        const images = await Promise.all(
            req.files.map(async (file) =>
                await uploadFile({ buffer: file.buffer, fileName: file.originalname })
            )
        );

        const newVariant = {
            color: color.trim(),
            colorHex: colorHex?.trim() || '#888888',
            images,
            sizes: parsedSizes,
        };

        product.variant.push(newVariant);
        await product.save();

        res.status(201).json({
            success: true,
            message: "Variant added successfully",
            product,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};