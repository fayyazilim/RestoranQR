export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
}

export interface Business {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  currencySymbol?: string;
  status: 'draft' | 'active' | 'suspended';
  isPublished: boolean;
  totalViews: number;
  qrCodeUrl?: string;
  theme?: any;
  workingHours?: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
}

export interface Category {
  _id: string;
  business: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

export interface Product {
  _id: string;
  business: string;
  category: any;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  allergens?: string[];
  inStock: boolean;
  stockCount?: number;
  order: number;
  isActive: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  calories?: string;
  preparationTime?: string;
}

export interface Theme {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  colors: {
    light: any;
    dark: any;
  };
  typography: any;
  layout?: any;
  isPremium?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentPayments: any[];
  topBusinesses: any[];
}
