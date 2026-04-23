import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL, COUPONS } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const applyCoupon = () => {
    const found = COUPONS.find((c) => c.code === code.trim().toUpperCase());
    if (!found) return toast.error("Cupom inválido");
    if (subtotal < found.minTotal) return toast.error(`Mínimo de ${formatBRL(found.minTotal)}`);
    setCoupon(found);
    toast.success(`Cupom ${found.code} aplicado!`);
  };

  const discount = coupon ? subtotal * coupon.discount : 0;
  const shipping = subtotal >= 199 || subtotal === 0 ? 0 : 19.9;
  const total = subtotal - discount + shipping;

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Faça login para finalizar a compra");
      return navigate("/login?redirect=/carrinho");
    }
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "paid",
          subtotal,
          discount,
          shipping,
          total,
          coupon_code: coupon?.code ?? null,
          payment_method: "simulated",
          customer_email: user.email,
        })
        .select()
        .single();
      if (error) throw error;

      const itemsPayload = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        product_image: i.product.image_url,
        unit_price: i.product.price,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      clear();
      setCoupon(null);
      toast.success("Pedido realizado com sucesso!");
      navigate("/conta");
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
                className="flex-1 bg-muted border border-border rounded-lg px-3 h-10 text-sm outline-none focus:border-primary"
              />
              <button onClick={applyCoupon} className="px-4 h-10 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90">
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {coupon && (
              <div className="text-xs text-success bg-success/10 border border-success/20 rounded-lg p-2">
                Cupom <strong>{coupon.code}</strong> aplicado
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(subtotal)}</span></div>
              {coupon && <div className="flex justify-between text-success"><span>Desconto</span><span>-{formatBRL(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatBRL(total)}</span></div>
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
