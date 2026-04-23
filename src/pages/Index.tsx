import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/types";
import { ArrowRight, Truck, Shield, Zap, Award, Dumbbell, Flame, Pill, Sparkles } from "lucide-react";

const Index = () => {
  const { products, loading } = useProducts({ activeOnly: true });
  const featured = products.slice(0, 8);
  const offers = products.filter((p) => p.old_price).slice(0, 4);

  const categoryIcons: Record<string, any> = {
    "Whey Protein": Dumbbell,
    "Creatina": Flame,
    "Pré-Treinos": Zap,
    "Vitaminas": Pill,
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container relative py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
              FRETE GRÁTIS acima de R$199
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
              FORJE SEU<br />
              <span className="text-gradient">CORPO MÁXIMO</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Suplementos premium para quem treina pesado. Whey, creatina, pré-treino e muito mais com até <strong className="text-primary-glow">29% OFF</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/categoria"
                className="group inline-flex items-center gap-2 gradient-primary px-6 h-12 rounded-xl font-semibold shadow-glow hover:shadow-intense transition-all"
              >
                Comprar agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/combos"
                className="inline-flex items-center gap-2 glass px-6 h-12 rounded-xl font-semibold hover:bg-white/15 transition-all"
              >
                Ver combos
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-white/60">
              <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary-glow" /> Entrega expressa</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary-glow" /> 100% Original</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-primary-glow" /> +50k clientes</span>
            </div>
          </div>

          <div className="relative animate-fade-in-up delay-200">
            <div className="absolute inset-0 gradient-primary blur-3xl opacity-40 animate-pulse-glow rounded-full" />
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-rotate-slow" />
              <img
                src="https://storage.googleapis.com/nexapp-flutter.appspot.com/production/products/2015371e92e95b7b5859868de72797c0"
                alt="Whey Protein Aforja"
                className="relative w-full h-full object-contain animate-float drop-shadow-2xl rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 gradient-primary text-white rounded-2xl px-5 py-3 shadow-intense rotate-6 animate-fade-in delay-400">
                <div className="text-[10px] tracking-widest opacity-80">A PARTIR DE</div>
                <div className="font-display text-3xl">R$89</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold tracking-widest text-primary mb-1">CATEGORIAS</div>
            <h2 className="font-display text-3xl md:text-4xl">Explore por categoria</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => {
            const Icon = categoryIcons[c] || Dumbbell;
            return (
              <Link
                key={c}
                to={`/categoria?cat=${encodeURIComponent(c)}`}
                className="group relative bg-card border border-border rounded-2xl p-6 hover-lift overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 gradient-primary rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{c}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-primary transition-colors">
                    Ver todos <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* OFERTAS */}
      {offers.length > 0 && (
        <section className="container py-10">
          <div className="rounded-3xl gradient-dark text-white p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 gradient-primary rounded-full opacity-20 blur-3xl" />
            <div className="relative flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-bold tracking-widest text-primary-glow mb-1">⚡ OFERTAS RELÂMPAGO</div>
                <h2 className="font-display text-3xl md:text-4xl">Desconto monstro</h2>
              </div>
              <Link to="/categoria" className="text-sm flex items-center gap-1 text-primary-glow hover:underline">
                Ver tudo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {offers.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold tracking-widest text-primary mb-1">MAIS VENDIDOS</div>
            <h2 className="font-display text-3xl md:text-4xl">Os preferidos da galera</h2>
          </div>
          <Link to="/categoria" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-3xl gradient-primary p-10 md:p-16 text-white text-center relative overflow-hidden shadow-intense">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-4xl md:text-5xl">Cadastre-se e ganhe 10% OFF</h2>
            <p className="text-white/90">Use o cupom <strong className="bg-white/20 px-2 py-0.5 rounded">GAB10</strong> em sua primeira compra.</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-primary px-6 h-12 rounded-xl font-semibold hover:scale-105 transition-transform">
              Criar minha conta <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
