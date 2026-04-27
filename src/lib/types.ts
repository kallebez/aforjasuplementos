export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
  badge: string | null;
  tags: string[];
  rating: number;
  rating_count: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon_code: string | null;
  payment_method: string | null;
  customer_email: string | null;
  customer_name: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_CATEGORIES = ["Whey Protein", "Creatina", "Pré-Treinos", "Vitaminas"] as const;

// Coupon validation is performed server-side in the `checkout` Edge Function.
// Codes and discount percentages are intentionally NOT shipped to the client.


export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
