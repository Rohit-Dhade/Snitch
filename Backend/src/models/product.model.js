import mongoose from 'mongoose';
import priceSchema from './price.schema.js';

// Size entry inside a color variant
const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    price: {
        type: priceSchema,
    },
}, { _id: false });

// Color variant — one entry per color, each has its own photos + sizes
const colorVariantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,   // e.g. "Black", "Olive Green"
    },
    colorHex: {
        type: String,
        default: '#888888', // fallback swatch color
    },
    images: [
        {
            url: { type: String, required: true },
        }
    ],
    sizes: [sizeSchema],
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        amount: { type: Number, required: true },
        currency: {
            type: String,
            enum: ['INR', 'USD'],
            default: 'INR',
        },
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    images: [
        {
            url: { type: String, required: true },
        }
    ],
    variant: [colorVariantSchema],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;