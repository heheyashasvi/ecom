import mongoose from 'mongoose';
import Product from '../src/models/Product';
import Order from '../src/models/Order';

const MONGODB_URI = process.env.MONGODB_URI;

const sampleProducts = [
    {
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
        price: 199.99,
        stock: 45,
        category: "Electronics",
        sku: "WH-2024-001",
        status: "active",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        colors: ["Black", "Silver", "Blue"],
        sizes: []
    },
    {
        name: "Running Shoes",
        description: "Lightweight running shoes with advanced cushioning technology",
        price: 129.99,
        stock: 78,
        category: "Sports",
        sku: "RS-2024-002",
        status: "active",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
        colors: ["Red", "Blue", "White"],
        sizes: ["8", "9", "10", "11"]
    },
    {
        name: "Coffee Maker",
        description: "Programmable coffee maker with thermal carafe",
        price: 89.99,
        stock: 32,
        category: "Home",
        sku: "CM-2024-003",
        status: "active",
        images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500"],
        colors: ["Black", "Stainless Steel"],
        sizes: []
    },
    {
        name: "Yoga Mat",
        description: "Non-slip eco-friendly yoga mat with carrying strap",
        price: 34.99,
        stock: 120,
        category: "Sports",
        sku: "YM-2024-004",
        status: "active",
        images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"],
        colors: ["Purple", "Blue", "Pink"],
        sizes: []
    },
    {
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitor and GPS",
        price: 249.99,
        stock: 56,
        category: "Electronics",
        sku: "SW-2024-005",
        status: "active",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        colors: ["Black", "Rose Gold", "Silver"],
        sizes: ["S", "M", "L"]
    }
];

const sampleOrders = [
    {
        customerName: "John Doe",
        email: "john@example.com",
        items: [
            { productId: "temp1", name: "Wireless Headphones", quantity: 2, price: 199.99 }
        ],
        totalAmount: 399.98,
        status: "completed",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        customerName: "Jane Smith",
        email: "jane@example.com",
        items: [
            { productId: "temp2", name: "Running Shoes", quantity: 1, price: 129.99 },
            { productId: "temp4", name: "Yoga Mat", quantity: 1, price: 34.99 }
        ],
        totalAmount: 164.98,
        status: "completed",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        customerName: "Mike Johnson",
        email: "mike@example.com",
        items: [
            { productId: "temp5", name: "Smart Watch", quantity: 1, price: 249.99 }
        ],
        totalAmount: 249.99,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
        customerName: "Sarah Wilson",
        email: "sarah@example.com",
        items: [
            { productId: "temp3", name: "Coffee Maker", quantity: 1, price: 89.99 }
        ],
        totalAmount: 89.99,
        status: "completed",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
];

async function seed() {
    try {
        if (!MONGODB_URI) {
            console.error("MONGODB_URI not defined!");
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log("Cleared existing data");

        // Insert products
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${insertedProducts.length} products`);

        // Update order items with real product IDs
        const ordersWithRealIds = sampleOrders.map((order, idx) => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                productId: insertedProducts[parseInt(item.productId.replace('temp', '')) - 1]._id
            }))
        }));

        // Insert orders
        const insertedOrders = await Order.insertMany(ordersWithRealIds);
        console.log(`Inserted ${insertedOrders.length} orders`);

        console.log("\n✅ Database seeded successfully!");
        console.log(`Total Revenue: $${ordersWithRealIds.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
