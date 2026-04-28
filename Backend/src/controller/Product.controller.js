import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.services.js";

export const CreateProductController = async (req, res) => {

    const { title, description, priceAmount, priceCurrency } = req.body;
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
        const { productId, stock, attributes, priceAmount, priceCurrency } = req.body;

        const product = await ProductModel.findById(productId);

        // null-check must come before any property access
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const parseAttributes = JSON.parse(attributes);

        const images = await Promise.all(
            req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });
            })
        );

        const newVariant = {
            stock,
            attributes: parseAttributes,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR",
            },
            images,
        };

        product.variant.push(newVariant);

        await product.save();

        res.status(201).json({
            success: true,
            message: "Variant added successfully",
            product,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};