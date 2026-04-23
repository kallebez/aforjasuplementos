import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/types";
import { Package, LogOut, ShoppingBag } from "lucide-react";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  if (loading) return <Layout><div className="container py-20 text-center">Carregando...</div></Layout>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs text-muted-foreground">Olá,</div>
            <h1 className="font-display text-3xl">{user.email}</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border hover:bg-muted text-sm">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Meus pedidos</h2>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Você ainda não fez pedidos</p>
            <Link to="/" className="inline-block gradient-primary text-white px-6 h-11 leading-[2.75rem] rounded-xl font-semibold">Ir às compras</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-5 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Pedido #{o.id.slice(0, 8)}</div>
                    <div className="text-sm font-semibold">{new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 uppercase">{o.status}</span>
                </div>
                <div className="space-y-1 text-sm border-t border-border pt-3">
                  {(o.order_items ?? []).map((it: any) => (
                    <div key={it.id} className="flex justify-between text-muted-foreground">
                      <span>{it.quantity}x {it.product_name}</span>
                      <span>{formatBRL(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-primary mt-3 pt-3 border-t border-border">
                  <span>Total</span>
                  <span>{formatBRL(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
