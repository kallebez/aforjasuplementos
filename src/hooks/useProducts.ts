import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";

export const useProducts = (filters?: { category?: string; search?: string; activeOnly?: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (filters?.activeOnly !== false) query = query.eq("active", true);
    if (filters?.category) query = query.eq("category", filters.category);
    const { data, error } = await query;
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    let result = (data ?? []) as Product[];
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    setProducts(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.category, filters?.search, filters?.activeOnly]);

  return { products, loading, error, refetch: fetchProducts };
};
