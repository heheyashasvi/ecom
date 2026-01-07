import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { MOCK_ORDERS } from "@/lib/mock-data";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await params;

        const conn = await connectToDatabase();

        // Check for Mock Mode via connection failure or env
        if (!conn) {
            const mockOrder = MOCK_ORDERS.find(o => o._id === orderId);
            if (!mockOrder) {
                return NextResponse.json({ error: "Order not found (Mock)" }, { status: 404 });
            }
            return NextResponse.json(mockOrder);
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
