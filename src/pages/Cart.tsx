import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SHIPPING_FEE = 19.9;
const FREE_SHIPPING_THRESHOLD = 199;

const Cart = () => {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Estimated discount returned by the server after applying a coupon.
  const [couponPreview, setCouponPreview] = useState<{
    code: string;
    discount: number;
    shipping: number;
    total: number;
  } | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Client-side estimates for display only. The server is the source of truth
  // and will recompute everything at checkout — these values are NEVER sent.
  const estimatedDiscount = couponPreview?.discount ?? 0;
  const estimatedShipping =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const estimatedTotal = Math.max(0, subtotal - estimatedDiscount + estimatedShipping);

  const applyCoupon = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (!/^[A-Z0-9_-]{1,32}$/.test(trimmed)) {
      return toast.error("Cupom inválido");
    }
    // Optimistic UI: just store the code; the server validates at checkout.
    // We can't preview the discount without exposing coupon rules client-side.
    setCouponPreview({ code: trimmed, discount: 0, shipping: estimatedShipping, total: estimatedTotal });
    toast.success(`Cupom ${trimmed} será validado no checkout`);
  };

  const WHATSAPP_NUMBER = "5516997516125";

  const buildWhatsappMessage = (orderId?: string, totals?: { subtotal: number; discount: number; shipping: number; total: number; couponCode?: string | null }) => {
    const lines: string[] = [];
    lines.push("*Novo pedido - A Forja Suplementos*");
    if (orderId) lines.push(`Pedido: ${orderId}`);
    if (user?.email) lines.push(`Cliente: ${user.email}`);
    lines.push("");
    lines.push("*Itens:*");
    items.forEach((i) => {
      lines.push(`• ${i.quantity}x ${i.product.name} — ${formatBRL(i.product.price * i.quantity)}`);
    });
    lines.push("");
    const s = totals?.subtotal ?? subtotal;
    const d = totals?.discount ?? estimatedDiscount;
    const sh = totals?.shipping ?? estimatedShipping;
    const t = totals?.total ?? estimatedTotal;
    lines.push(`Subtotal: ${formatBRL(s)}`);
    if (d > 0) lines.push(`Desconto: -${formatBRL(d)}`);
    lines.push(`Frete: ${sh === 0 ? "Grátis" : formatBRL(sh)}`);
    if (totals?.couponCode) lines.push(`Cupom: ${totals.couponCode}`);
    lines.push(`*Total: ${formatBRL(t)}*`);
    return lines.join("\n");
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Faça login para finalizar a compra");
      return navigate("/login?redirect=/carrinho");
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        couponCode: couponPreview?.code ?? null,
      };

      const { data, error } = await supabase.functions.invoke("checkout", { body: payload });
      if (error) {
        const msg =
          (data as any)?.error ||
          (error as any)?.context?.error ||
          error.message ||
          "Erro ao finalizar a compra";
        throw new Error(msg);
      }
      if (!data?.success) {
        throw new Error((data as any)?.error || "Erro ao finalizar a compra");
      }

      const message = buildWhatsappMessage(data.orderId, {
        subtotal: data.subtotal,
        discount: data.discount,
        shipping: data.shipping,
        total: data.total,
        couponCode: data.couponCode,
      });
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      clear();
      setCouponPreview(null);
      toast.success("Pedido realizado! Abrindo WhatsApp...");
      // window.open após await costuma ser bloqueado pelo navegador.
      // Navegar a aba atual para o wa.me garante a abertura do WhatsApp.
      window.location.href = url;
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl mb-2">Carrinho vazio</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos para começar</p>
          <Link to="/" className="inline-block gradient-primary text-white px-6 h-12 leading-[3rem] rounded-xl font-semibold hover:shadow-glow transition-all">
            Ir às compras
          </Link>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="font-display text-3xl mb-4">Seu carrinho</h1>
          {items.map((item) => (
            <div key={item.product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 animate-fade-in">
              <Link to={`/produto/${item.product.id}`} className="w-24 h-24 bg-muted rounded-xl overflow-hidden shrink-0">
                {item.product.image_url && <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produto/${item.product.id}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <div className="text-xs text-muted-foreground mt-1">{item.product.category}</div>
                <div className="font-bold text-primary mt-1">{formatBRL(item.product.price)}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center bg-muted rounded-lg">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-border rounded-l-lg">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-border rounded-r-lg">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-44 space-y-4">
            <h2 className="font-bold text-lg">Resumo do pedido</h2>

            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Cupom"
                maxLength={32}
                className="flex-1 bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary"
              />
              <button onClick={applyCoupon} className="px-4 h-10 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {couponPreview && (
              <div className="text-xs text-success bg-success/10 border border-success/20 rounded-lg p-2">
                Cupom <strong>{couponPreview.code}</strong> será aplicado se válido
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frete estimado</span><span>{estimatedShipping === 0 ? "Grátis" : formatBRL(estimatedShipping)}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border"><span>Total estimado</span><span className="text-primary">{formatBRL(estimatedTotal)}</span></div>
              <p className="text-[11px] text-muted-foreground">Cupom e total finais são calculados de forma segura no servidor.</p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full gradient-primary text-white font-semibold h-12 rounded-xl hover:shadow-glow transition-all disabled:opacity-60"
            >
              {loading ? "Processando..." : "Finalizar compra"}
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Pagamento simulado para demonstração. Stripe será configurado em breve.
            </p>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default Cart;
