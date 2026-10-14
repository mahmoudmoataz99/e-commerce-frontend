export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  original_price?: string | number | null;
  image: string;
  category_id: number;
  description: string;
  rating: string | number;
  review_count: number;
  in_stock: boolean;
  tags: string[];
  sizes: string[];
  colors: string[];
  category?: Category;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  selected_size?: string | null;
  selected_color?: string | null;
  product: Product;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
}

export interface Address {
  id: number;
  user_id: number;
  label: string;
  address: string;
  is_default: boolean;
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  label: string;
  last4: string;
  type: string;
  is_default: boolean;
}

export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order?: number;
  max_uses?: number;
  used_count?: number;
  expires_at?: string | null;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: string | number;
  quantity: number;
  selected_size?: string | null;
  selected_color?: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: string | number;
  tax: string | number;
  discount: string | number;
  shipping_cost: string | number;
  total: string | number;
  address: string;
  payment_method: string;
  promo_code?: string | null;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface AppNotification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
