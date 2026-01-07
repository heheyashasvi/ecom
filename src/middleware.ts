import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // Allow access to onboarding page without login
            if (req.nextUrl.pathname.startsWith("/admin/onboard")) {
                return true;
            }
            // Require token for other protected routes
            return !!token
        },
    },
})

export const config = { matcher: ["/", "/products/:path*"] }
