import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // HARDCODED DEMO USER FOR PUBLIC ACCESS
                if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
                    return {
                        id: "demo_user_id",
                        name: "Demo Admin",
                        email: "demo@example.com",
                        role: "admin",
                    };
                }

                // CHECK FOR MOCK MODE
                // We use process.env.MOCK_MODE which was set in db.ts or env file
                // Note: db.ts handles the connection logic, but here we need to bypass User.findOne
                if (process.env.MOCK_MODE === 'true' || !process.env.MONGODB_URI) {
                    console.log("Mock Auth: Logging in without DB");
                    return {
                        id: "mock_user_id",
                        name: "Mock Admin",
                        email: credentials.email,
                        role: "admin",
                    }
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found");
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
