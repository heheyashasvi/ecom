import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    sku: {
        type: String,
        required: [true, 'Please provide a SKU'],
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'active',
    },
    colors: {
        type: [String],
        default: [],
    },
    sizes: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
