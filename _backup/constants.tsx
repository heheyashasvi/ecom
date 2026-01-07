
import { Product, Admin, SalesData } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pro Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 40h battery life.',
    price: 299.99,
    stock: 45,
    category: 'Electronics',
    status: 'active',
    image: 'https://picsum.photos/seed/hp1/400/400',
    createdAt: '2023-10-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health, sleep, and workouts with ease.',
    price: 149.50,
    stock: 120,
    category: 'Wearables',
    status: 'active',
    image: 'https://picsum.photos/seed/sw1/400/400',
    createdAt: '2023-11-02T14:30:00Z'
  },
  {
    id: '3',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical switches for pro gamers.',
    price: 89.99,
    stock: 15,
    category: 'Peripherals',
    status: 'draft',
    image: 'https://picsum.photos/seed/kb1/400/400',
    createdAt: '2023-12-05T09:15:00Z'
  }
];

export const INITIAL_ADMINS: Admin[] = [
  {
    id: 'admin-1',
    email: 'admin@swiftadmin.com',
    name: 'John Doe',
    role: 'super-admin',
    lastLogin: new Date().toISOString()
  }
];

export const SALES_METRICS: SalesData[] = [
  { name: 'Jan', sales: 400, revenue: 2400 },
  { name: 'Feb', sales: 300, revenue: 1398 },
  { name: 'Mar', sales: 900, revenue: 9800 },
  { name: 'Apr', sales: 500, revenue: 3908 },
  { name: 'May', sales: 700, revenue: 4800 },
  { name: 'Jun', sales: 600, revenue: 3800 },
];
