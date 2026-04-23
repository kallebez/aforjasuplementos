import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado");
    load();
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-2">Pedidos</h1>
      <p className="text-muted-foreground mb-8">{orders.length} pedido(s) registrado(s)</p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">Nenhum pedido ainda</div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id}>
                <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full flex items-center gap-4 p-4 hover:bg-muted/40 text-left">
                  {open === o.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm items-center">
                    <div>
                      <div className="font-semibold">#{o.id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
                    </div>
                    <div className="text-xs truncate">{o.customer_email ?? "—"}</div>
                    <div className="font-bold text-primary">{formatBRL(o.total)}</div>
                    <div className="text-xs">{o.order_items?.length ?? 0} item(s)</div>
                    <select
                      value={o.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-muted border border-border rounded-lg px-2 h-8 text-xs outline-none focus:border-primary uppercase font-semibold"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </button>
                {open === o.id && (
                  <div className="p-4 pl-12 bg-muted/30 space-y-2 animate-fade-in">
                    {(o.order_items ?? []).map((it: any) => (
                      <div key={it.id} className="flex items-center gap-3 text-sm">
                        <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                          {it.product_image && <img src={it.product_image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">{it.product_name}</div>
                        <div>{it.quantity}x</div>
                        <div className="font-semibold w-24 text-right">{formatBRL(it.subtotal)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
