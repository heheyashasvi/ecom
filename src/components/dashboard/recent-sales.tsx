import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentSalesProps {
    orders: any[]
}

export function RecentSales({ orders }: RecentSalesProps) {
    if (orders.length === 0) {
        return <p className="text-sm text-muted-foreground">No recent sales.</p>
    }

    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <div key={order._id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://avatar.vercel.sh/${order.email}`} alt="Avatar" />
                        <AvatarFallback>{order.customerName ? order.customerName.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                            {order.email}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(order.totalAmount)}
                    </div>
                </div>
            ))}
        </div>
    )
}
