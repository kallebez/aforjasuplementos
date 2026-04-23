import Layout from "@/components/layout/Layout";
import { useProducts } from "@/hooks/useProducts";
import { formatBRL } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Combos = () => {
  const { products } = useProducts();
  const { addItem } = useCart();
  const combos = [
    {
      title: "Combo Massa Monstro",
      desc: "Whey + Creatina para máximo ganho de massa",
      keys: ["Whey Protein", "Creatina"],
      discount: 0.15,
    },
    {
      title: "Combo Energia Total",
      desc: "Pré-treino + Termogênico para foco e queima",
      keys: ["Pré-Treinos", "Pré-Treinos"],
      discount: 0.18,
    },
    {
      title: "Combo Saúde Pro",
      desc: "Multivitamínico + Vitamina D para imunidade",
      keys: ["Vitaminas", "Vitaminas"],
      discount: 0.12,
    },
  ];

  const buildCombo = (keys: string[]) => {
    return keys.map((k, i) => products.filter((p) => p.category === k)[i] || products.find((p) => p.category === k)).filter(Boolean);
  };

  return (
    <Layout>
      <section className="gradient-hero text-white py-16">
        <div className="container">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" /> COMBOS EXCLUSIVOS
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Combos com mega desconto</h1>
          <p className="text-white/70 mt-2 max-w-xl">Combine produtos premium e economize até 18%.</p>
        </div>
      </section>

      <div className="container py-12 grid md:grid-cols-3 gap-6">
        {combos.map((c, i) => {
          const items = buildCombo(c.keys);
          const subtotal = items.reduce((s, it) => s + (it?.price || 0), 0);
          const total = subtotal * (1 - c.discount);
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="inline-block gradient-primary text-white text-xs font-bold px-3 py-1 rounded-md shadow-glow mb-3">
                -{Math.round(c.discount * 100)}% OFF
              </span>
              <h3 className="font-display text-2xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{c.desc}</p>
              <div className="space-y-2 mb-4 border-t border-border pt-4">
                {items.map((it: any) => (
                  <div key={it?.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                      {it?.image_url && <img src={it.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 text-xs font-medium line-clamp-2">{it?.name}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs line-through text-muted-foreground">{formatBRL(subtotal)}</div>
                <div className="text-2xl font-bold text-primary">{formatBRL(total)}</div>
              </div>
              <button
                onClick={() => items.forEach((it: any) => it && addItem(it))}
                className="w-full mt-4 gradient-primary text-white font-semibold h-11 rounded-xl hover:shadow-glow transition-all"
              >
                Adicionar combo
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Combos;
