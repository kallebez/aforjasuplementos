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

export const CATEGORIES = ["Whey Protein", "Creatina", "Pré-Treinos", "Vitaminas"] as const;

export const COUPONS = [
  { code: "GAB10", discount: 0.1, minTotal: 0, description: "10% OFF em todo pedido" },
  { code: "FORJA15", discount: 0.15, minTotal: 150, description: "15% OFF acima de R$150" },
  { code: "POWER20", discount: 0.2, minTotal: 250, description: "20% OFF acima de R$250" },
  { code: "SAVE25", discount: 0.25, minTotal: 300, description: "25% OFF acima de R$300" },
];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
