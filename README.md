# Server-Rendered E-commerce Product Management Dashboard

A high-performance, server-side rendered (SSR) administrative dashboard for managing products in an e-commerce system. Built with Next.js, Tailwind CSS, shadcn/ui, and MongoDB.

## Live Demo

**Live Link**: [https://ecom-git-main-yashasvis-projects-5366dfe2.vercel.app](https://ecom-git-main-yashasvis-projects-5366dfe2.vercel.app)  
**Email**: `demo@example.com`  
**Password**: `demo123`

## Features

- **Server-Side Rendering (SSR)**: Enhanced performance and SEO using Next.js App Router.
- **Secure Authentication**: Admin login and protected routes using Next.js Auth.
- **Product Management**: Complete CRUD operations for products (Create, Read, Update, Delete).
- **Search & Filter**: Server-side filtering and sorting (implemented in API).
- **Image Upload**: Seamless image uploads using Cloudinary.
- **Data Visualization**: Interactive charts for stock and categories using Recharts.
- **Admin Onboarding**: Secure secret-based registration for new admins.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Setup Instructions

1. **Clone the repository** (or use the existing directory).

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
   NEXTAUTH_SECRET=changeme_in_production_secret_key_123
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_SECRET=secret123
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```
   *Note: Update `MONGODB_URI` if using a remote cluster.*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000).

## Admin Onboarding

To create the first admin account:
1. Navigate to `/admin/onboard`.
2. Fill in your details.
3. Enter the Admin Secret (default: `secret123` as configured in `.env.local`).
4. Login at `/auth/login`.

## Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities (Database connection, helpers).
- `src/models`: Mongoose models.
