export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  allergens?: string[];
  inStock: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
  calories?: string;
  preparationTime?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  products: Product[];
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
  workingHours?: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface Theme {
  _id: string;
  name: string;
  slug: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography?: {
    fontFamily: string;
  };
  layout?: {
    borderRadius: string;
    cardShadow: string;
  };
}

export interface MenuResponse {
  business: Business;
  theme: Theme;
  categories: Category[];
}
