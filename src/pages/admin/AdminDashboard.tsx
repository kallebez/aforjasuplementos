import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/types";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ count: pCount }, { count: oCount }, { data: revenueData }, { count: cCount }, { data: rOrders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        products: pCount ?? 0,
        orders: oCount ?? 0,
        revenue: (revenueData ?? []).reduce((s, o: any) => s + Number(o.total), 0),
        customers: cCount ?? 0,
      });
      setRecent(rOrders ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Produtos", value: stats.products, icon: Package, color: "from-blue-500 to-cyan-500" },
    { label: "Pedidos", value: stats.orders, icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
    { label: "Faturamento", value: formatBRL(stats.revenue), icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { label: "Clientes", value: stats.customers, icon: TrendingUp, color: "from-primary to-accent" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Visão geral da loja</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl bg-muted animate-pulse mb-4" />
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                <div className="h-7 w-24 rounded bg-muted animate-pulse mt-2" />
              </div>
            ))
          : cards.map((c, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-md-custom`}>
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="text-2xl font-bold mt-1">{c.value}</div>
              </div>
            ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">Pedidos recentes</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="space-y-1.5">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-4 w-20 rounded bg-muted animate-pulse ml-auto" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum pedido ainda</p>
        ) : (
          <div className="space-y-2">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-muted text-sm">
                <div>
                  <div className="font-semibold">#{o.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("pt-BR")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{formatBRL(o.total)}</div>
                  <div className="text-xs uppercase">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
