import { DataTable } from "../products/data-table"
import { columns } from "./columns" // We need to create this
import connectToDatabase from "@/lib/db"
import Order from "@/models/Order"

import { MOCK_ORDERS } from "@/lib/mock-data"

async function getOrders() {
    const conn = await connectToDatabase()
    if (conn) {
        // @ts-ignore
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
        return JSON.parse(JSON.stringify(orders))
    } else {
        return MOCK_ORDERS
    }
}

export default async function OrdersPage() {
    const data = await getOrders()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            </div>
            <DataTable columns={columns} data={data} searchKey="customerName" />
        </div>
    )
}
