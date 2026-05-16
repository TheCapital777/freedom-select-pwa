export type Role = "guest" | "customer" | "vendor" | "transport" | "admin";

export interface Product {
  id: string;
  name: string;
  category: string;
  vendor_id: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  specs: Record<string, string>;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  in_stock: boolean;
  featured: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  total_sales: number;
  commission_rate: number;
  wallet_balance: number;
  products_count: number;
  status: "active" | "pending" | "suspended";
  emoji: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  unit: string;
  subtotal: number;
  vendor_id: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  commission: number;
  vendor_payout: number;
  delivery_fee: number;
  status: "pending" | "confirmed" | "dispatched" | "delivered";
  delivery_address: string;
  created_at: string;
  notes: string;
}

export interface DeliveryTask {
  id: string;
  order_id: string;
  vendor_name: string;
  pickup_location: string;
  delivery_location: string;
  items_count: number;
  status: "pending" | "ready_for_pickup" | "picked_up" | "in_transit" | "delivered";
  customer_name: string;
  estimated_time: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
  vendor_id: string;
  emoji: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  active: boolean;
  comingSoon: boolean;
}
