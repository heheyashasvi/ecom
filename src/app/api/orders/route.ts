import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { z } from "zod";

const OrderCreateSchema = z.object({
    customerName: z.string().min(1),
    email: z.string().email(),
    orderItems: z.array(z.object({
        product: z.string(),
        quantity: z.number().int().positive(),
    })).min(1),
});

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
}

export async function POST(req: Request) {
    // NOTE: In a real app, this might be a webhook or public checkout API
    try {
        const body = await req.json();
        const validatedData = OrderCreateSchema.parse(body);

        await connectToDatabase();

        let totalAmount = 0;
        const orderItemsWithType = [];

        // Calculate total and verify stock
        for (const item of validatedData.orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({ error: `Product ${item.product} not found` }, { status: 404 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
            }

            const price = product.price;
            totalAmount += price * item.quantity;

            orderItemsWithType.push({
                product: item.product,
                quantity: item.quantity,
                price: price,
                name: product.name,
            });

            // Update stock
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        const order = await Order.create({
            customerName: validatedData.customerName,
            email: validatedData.email,
            totalAmount,
            status: 'pending',
            orderItems: orderItemsWithType,
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
