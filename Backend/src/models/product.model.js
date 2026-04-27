import mongoose from 'mongoose';
import priceSchema from './price.schema.js';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['INR', 'USD'],
            default: 'INR'
        }
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
        }
    ],
    variant: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema
            }
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;