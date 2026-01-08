import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';

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
        orderItems: [
            { product: "temp1", name: "Wireless Headphones", quantity: 2, price: 199.99 }
        ],
        totalAmount: 399.98,
        status: "delivered",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        customerName: "Jane Smith",
        email: "jane@example.com",
        orderItems: [
            { product: "temp2", name: "Running Shoes", quantity: 1, price: 129.99 },
            { product: "temp4", name: "Yoga Mat", quantity: 1, price: 34.99 }
        ],
        totalAmount: 164.98,
        status: "processing",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        customerName: "Mike Johnson",
        email: "mike@example.com",
        orderItems: [
            { product: "temp5", name: "Smart Watch", quantity: 1, price: 249.99 }
        ],
        totalAmount: 249.99,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
        customerName: "Sarah Wilson",
        email: "sarah@example.com",
        orderItems: [
            { product: "temp3", name: "Coffee Maker", quantity: 1, price: 89.99 }
        ],
        totalAmount: 89.99,
        status: "delivered",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
];

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing data
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Insert products
        const insertedProducts = await Product.insertMany(sampleProducts);

        // Update order items with real product IDs
        const ordersWithRealIds = sampleOrders.map((order) => {
            const tempItems = order.orderItems.map(item => {
                const tempIdMatch = item.product.match(/temp(\d+)/);
                const index = tempIdMatch ? parseInt(tempIdMatch[1]) - 1 : 0;
                return {
                    ...item,
                    product: insertedProducts[index]._id
                };
            });
            return { ...order, orderItems: tempItems };
        });

        // Insert orders
        await Order.insertMany(ordersWithRealIds);

        return NextResponse.json({
            message: "Database seeded successfully!",
            productsCount: insertedProducts.length,
            ordersCount: sampleOrders.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
