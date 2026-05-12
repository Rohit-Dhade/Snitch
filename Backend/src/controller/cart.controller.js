import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

export const AddToCartController = async (req, res) => {
    const productId = req.params.productId;
    const { variant, quantity, price, size } = req.body;
    const userId = req.user._id;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
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
        const item = cart.items.find(item => {
            const productMatch = item.product.toString() === productId;
            const variantMatch = variant ? (item.variant && item.variant.toString() === variant) : !item.variant;
            const sizeMatch = item.size === size;
            return productMatch && variantMatch && sizeMatch;
        });
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
                variant: variant || undefined,
                size,
                quantity,
                price: formattedPrice
            }]
        });
        await newCart.save();
        return res.status(201).json({ message: "Product added to cart successfully" });
    }
    else {
        const item = cart.items.find(item => {
            const productMatch = item.product.toString() === productId;
            const variantMatch = variant ? (item.variant && item.variant.toString() === variant) : !item.variant;
            const sizeMatch = item.size === size;
            return productMatch && variantMatch && sizeMatch;
        });
        if (item) {
            item.quantity += quantity;
            await cart.save();
            return res.status(200).json({ message: "Product added to cart successfully" });
        }
        else {
            cart.items.push({
                product: productId,
                variant: variant || undefined,
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

    const cart = await cartModel.aggregate(
        [
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            { $unwind: { path: '$items' } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: { path: '$items.product' } },
            {
                $unwind: { path: '$items.product.variant' }
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            '$items.variant',
                            '$items.product.variant._id'
                        ]
                    }
                }
            },
            {
                $addFields: {
                    itemPrice: {
                        price: {
                            $multiply: [
                                '$items.quantity',
                                '$items.price.amount'
                            ]
                        },
                        currency: '$items.price.currency'
                    }
                }
            },
            {
                $group: {
                    _id: '_id',
                    totalPrice: { $sum: '$itemPrice.price' },
                    currency: {
                        $first: '$itemPrice.currency'
                    },
                    items: { $push: '$items' }
                }
            }
        ]
    )

    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    return res.status(200).json({
        message: "Cart found",
        success: true,
        data: cart
    });
}

export const removeCartItemController = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    return res.status(200).json({
        message: "Cart item removed successfully",
        success: true,
        data: cart
    });
}

export const updateCartItemController = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity", success: false });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    const item = cart.items.id(itemId);
    if (!item) {
        return res.status(404).json({ message: "Cart item not found", success: false });
    }

    // Check stock
    const stock = await stockOfVariant(item.product, item.variant, item.size);
    if (stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock", success: false });
    }

    item.quantity = quantity;
    await cart.save();

    // Populate for the response
    const updatedCart = await cartModel.findOne({ user: userId }).populate('items.product');

    return res.status(200).json({
        message: "Cart item updated successfully",
        success: true,
        data: updatedCart
    });
}