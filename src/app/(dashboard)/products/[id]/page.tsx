import connectToDatabase from "@/lib/db"
import Product from "@/models/Product"
import ProductForm from "@/components/products/product-form"
import { notFound } from "next/navigation"

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params
    await connectToDatabase()
    const product = await Product.findById(id).lean()

    if (!product) {
        notFound()
    }

    // Convert to plain object
    const serializedProduct = JSON.parse(JSON.stringify(product))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
                <ProductForm initialData={serializedProduct} />
            </div>
        </div>
    )
}
