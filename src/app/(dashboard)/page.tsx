import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentSales } from "@/components/dashboard/recent-sales"
import connectToDatabase from "@/lib/db"
import Product from "@/models/Product"
import Order from "@/models/Order"
import { DollarSign, CreditCard, Package, Activity } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

import { MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/mock-data"

export default async function DashboardPage() {
    const conn = await connectToDatabase()

    let products = []
    let orders = []

    if (conn) {
        products = await Product.find({}).lean()
        // @ts-ignore
        orders = await Order.find({}).sort({ createdAt: -1 }).lean() // Fetch all for stats
    } else {
        console.log("Using Mock Data for Dashboard")
        // @ts-ignore
        products = MOCK_PRODUCTS
        // @ts-ignore
        orders = MOCK_ORDERS
    }

    const totalProducts = products.length
    // @ts-ignore
    const totalStock = products.reduce((acc, product) => acc + product.stock, 0)
    // @ts-ignore
    const totalValue = products.reduce((acc, product) => acc + (product.price * product.stock), 0)

    // Calculate Total Revenue from Orders
    // @ts-ignore
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)

    // Active Now - Mocked
    const activeNow = 3

    // 1. Group by category for Stock Chart
    // @ts-ignore
    const categoryData = products.reduce((acc: any, product: any) => {
        const category = product.category || "Uncategorized"
        if (!acc[category]) {
            acc[category] = 0
        }
        acc[category] += product.stock
        return acc
    }, {})

    const stockGraphData = Object.keys(categoryData).map((key) => ({
        name: key,
        total: categoryData[key],
    }))

    // 2. Group by Date for Revenue Chart (Last 7 days or monthly)
    // We'll aggregate by Month-Day for simplicity
    const revenueMap: { [key: string]: number } = {};

    // Initialize with recent few days so graph isn't empty if no sales
    // (Optional logic, skipping for pure data approach)

    // @ts-ignore
    orders.forEach((order: any) => {
        const date = new Date(order.createdAt);
        // Format: "Jan 01"
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!revenueMap[formattedDate]) {
            revenueMap[formattedDate] = 0;
        }
        revenueMap[formattedDate] += order.totalAmount;
    });

    // Convert map to array and sort by date? 
    // Since map iteration order isn't guaranteed and we want chronological, we might need better logic.
    // For simplicity with MongoDB IDs/Dates, let's just reverse stats or rely on insertion order if sparse.
    // A robust solution would fill in 0s for missing days. Let's do simple aggregation first.

    const revenueGraphData = Object.keys(revenueMap).map(key => ({
        name: key,
        total: revenueMap[key]
    })).slice(-7); // Just take last 7 entries for cleaner view if many

    // 3. Recent Sales (Top 5)
    const recentOrders = orders.slice(0, 5);


    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FadeIn delay={0.1}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Potential Value</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(totalValue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Value of current stock
                            </p>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                In {Object.keys(categoryData).length} categories
                            </p>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{activeNow}</div>
                            <p className="text-xs text-muted-foreground">
                                Admins online
                            </p>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <FadeIn delay={0.5} className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Revenue Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <RevenueChart data={revenueGraphData} />
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.6} className="col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentSales orders={recentOrders} />
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <FadeIn delay={0.7} className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Stock Level by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview data={stockGraphData} />
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}
