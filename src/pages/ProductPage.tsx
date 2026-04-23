import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft, Minus, Plus } from "lucide-react";

const ProductPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      setProduct(data as Product | null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Layout><div className="container py-20 text-center">Carregando...</div></Layout>;
  if (!product) return <Layout><div className="container py-20 text-center">Produto não encontrado.</div></Layout>;

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/categoria" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-muted rounded-2xl aspect-square overflow-hidden flex items-center justify-center relative animate-scale-in">
            {product.badge && (
              <span className="absolute top-4 left-4 gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-glow">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-secondary text-white text-sm font-bold px-3 py-1.5 rounded-md">-{discount}%</span>
            )}
            {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
          </div>

          <div className="space-y-5 animate-fade-in-up">
            <div className="text-xs font-bold tracking-widest text-primary">{product.brand} • {product.category}</div>
            <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
              <span className="text-sm text-muted-foreground">({product.rating_count} avaliações)</span>
            </div>

            <div className="bg-muted rounded-2xl p-5 space-y-1">
              {product.old_price && (
                <div className="text-sm text-muted-foreground line-through">{formatBRL(product.old_price)}</div>
              )}
              <div className="text-4xl font-bold text-primary">{formatBRL(product.price)}</div>
              <div className="text-sm text-muted-foreground">ou 12x de {formatBRL(product.price / 12)} sem juros</div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-muted rounded-xl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-border rounded-l-xl">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-12 flex items-center justify-center hover:bg-border rounded-r-xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => addItem(product, qty)}
                className="flex-1 gradient-primary text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 hover:shadow-intense transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" /> Adicionar ao carrinho
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck, t: "Frete grátis", s: "Acima de R$199" },
                { icon: Shield, t: "100% Original", s: "Garantido" },
                { icon: RotateCcw, t: "Troca fácil", s: "Em até 7 dias" },
              ].map((b, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 text-center">
                  <b.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-xs font-semibold">{b.t}</div>
                  <div className="text-[10px] text-muted-foreground">{b.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
