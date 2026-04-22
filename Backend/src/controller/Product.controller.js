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

    console.log(images)

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
        products
    });
};