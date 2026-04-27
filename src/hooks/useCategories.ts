import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/lib/types";

export const useCategories = (activeOnly = true) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    let query = supabase.from("categories" as any).select("*").order("sort_order", { ascending: true }).order("name", { ascending: true });
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setCategories((data ?? []) as unknown as Category[]);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [activeOnly]);

  return { categories, loading, error, refetch: fetchCategories };
};