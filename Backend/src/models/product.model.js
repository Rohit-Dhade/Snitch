import mongoose from 'mongoose';

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
    image: [
        {
            url: {
                type: String,
                required: true
            },
        }
    ],

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;