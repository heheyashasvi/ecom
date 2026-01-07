
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  image: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'manager';
  lastLogin: string;
}

export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

export type View = 'dashboard' | 'products' | 'onboarding' | 'settings';
