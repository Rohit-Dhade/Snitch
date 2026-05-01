import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const AddToCartController = async (req, res) => {
    const productId = req.params.productId;
    const { variant, quantity, price, size } = req.body;
    const userId = req.user._id;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if (!variant) {
        return res.status(400).json({ message: "Variant is required" });
    }

    if (!quantity) {
        return res.status(400).json({ message: "Quantity is required" });
    }

    if (!price) {
        return res.status(400).json({ message: "Price is required" });
    }

    const cart = await cartModel.findOne({ user: userId });
    const stock = await stockOfVariant(productId, variant, size);

    // Check if the current quantity in cart + requested quantity exceeds stock
    let currentQuantityInCart = 0;
    if (cart) {
        const item = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variant && item.size === size);
        if (item) {
            currentQuantityInCart = item.quantity;
        }
    }

    if (stock < quantity + currentQuantityInCart) {
        return res.status(400).json({ message: "Stock is not enough" });
    }

    let formattedPrice = price;
    if (typeof price === 'number' || typeof price === 'string') {
        formattedPrice = { amount: Number(price), currency: "INR" };
    } else if (price && !price.amount) {
        formattedPrice = { amount: Number(price.amount || price), currency: price.currency || "INR" };
    }

    if (!cart) {
        const newCart = new cartModel({
            user: userId,
            items: [{
                product: productId,
                variant,
                size,
                quantity,
                price: formattedPrice
            }]
        });
        await newCart.save();
        return res.status(201).json({ message: "Product added to cart successfully" });
    }
    else {
        const item = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variant && item.size === size);
        if (item) {
            item.quantity += quantity;
            await cart.save();
            return res.status(200).json({ message: "Product added to cart successfully" });
        }
        else {
            cart.items.push({
                product: productId,
                variant,
                size,
                quantity,
                price: formattedPrice
            });
            await cart.save();
            return res.status(200).json({ message: "Product added to cart successfully" });
        }
    }
}

export const viewCartController = async (req, res) => {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId }).populate('items.product')
    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    return res.status(200).json({
        message: "Cart found",
        success: true,
        data: cart
    });
}