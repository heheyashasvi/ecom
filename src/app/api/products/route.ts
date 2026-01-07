import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { z } from "zod";

const ProductCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    category: z.string().min(1),
    images: z.array(z.string()).optional(),
    sku: z.string().min(1),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
});

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = ProductCreateSchema.parse(body);

        await connectToDatabase();

        // Check SKU uniqueness
        const existingSku = await Product.findOne({ sku: validatedData.sku });
        if (existingSku) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
        }

        const product = await Product.create(validatedData);

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
