import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import connectToDatabase from "@/lib/db"
import Order from "@/models/Order"
import { MOCK_ORDERS } from "@/lib/mock-data"
import { ArrowLeft, Mail, User as UserIcon, Calendar, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface OrderDetailsPageProps {
    params: {
        orderId: string
    }
}

async function getOrder(orderId: string) {
    const conn = await connectToDatabase()

    if (!conn) {
        const mockOrder = MOCK_ORDERS.find(o => o._id === orderId)
        return mockOrder ? JSON.parse(JSON.stringify(mockOrder)) : null
    }

    try {
        const order = await Order.findById(orderId).lean()
        return order ? JSON.parse(JSON.stringify(order)) : null
    } catch (e) {
        // Fallback to mock data if ID is not a valid ObjectId (e.g. "ord_1")
        const mockOrder = MOCK_ORDERS.find(o => o._id === orderId)
        return mockOrder ? JSON.parse(JSON.stringify(mockOrder)) : null
    }
}

export default async function OrderDetailsPage(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
    const order = await getOrder(params.orderId)

    if (!order) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/orders">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Order #{order._id.slice(-6)}</h2>
                        <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={order.status === "pending" ? "outline" : order.status === "processing" ? "secondary" : order.status === "shipped" ? "default" : order.status === "delivered" ? "default" : "destructive"}>
                        {order.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription>Items in this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name || `Product ${item.product}`}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price * item.quantity)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)} each
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No items in this order (Mock Data might be limited)</div>
                            )}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between pt-4">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalAmount)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Customer Name</p>
                                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Order Date</p>
                                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
