import { DataTable } from "./data-table"
import { columns } from "./columns"
import connectToDatabase from "@/lib/db"
import Product from "@/models/Product"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

export const dynamic = 'force-dynamic'

async function getProducts() {
    const conn = await connectToDatabase()
    if (conn) {
        const products = await Product.find({}).sort({ createdAt: -1 }).lean()
        return JSON.parse(JSON.stringify(products)) // To serializable plain objects
    } else {
        return MOCK_PRODUCTS
    }
}

export default async function ProductsPage() {
    const data = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Button asChild>
                    <Link href="/products/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="name" />
        </div>
    )
}
