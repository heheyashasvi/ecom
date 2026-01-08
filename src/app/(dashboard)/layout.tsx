import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { LayoutDashboard, Package, LogOut, User } from "lucide-react";
import SignOutButton from "@/components/admin/SignOutButton";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r hidden md:block">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin</h1>
                    <ModeToggle />
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        <Package className="w-5 h-5 mr-3" />
                        Products
                    </Link>
                    <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        <Package className="w-5 h-5 mr-3" />
                        Orders
                    </Link>
                    <Link
                        href="/admin/onboard"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        <User className="w-5 h-5 mr-3" />
                        Add Admin
                    </Link>
                </nav>
                <div className="absolute bottom-4 px-4 w-64">
                    <div className="flex items-center px-4 py-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        {session.user?.email}
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
