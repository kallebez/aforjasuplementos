import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cat = params.get("cat") || undefined;
  const search = params.get("busca") || undefined;
  const { products, loading } = useProducts({ category: cat, search });
  const { categories } = useCategories();

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-4xl mb-2">{cat || (search ? `Busca: "${search}"` : "Todos os produtos")}</h1>
        <p className="text-muted-foreground mb-8">{products.length} produto(s) encontrado(s)</p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => navigate("/categoria")}
            className={`px-4 h-10 rounded-xl border text-sm font-medium transition-all ${!cat ? "gradient-primary text-white border-transparent shadow-glow" : "border-border hover:border-primary"}`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/categoria?cat=${encodeURIComponent(category.name)}`)}
              className={`px-4 h-10 rounded-xl border text-sm font-medium transition-all ${cat === category.name ? "gradient-primary text-white border-transparent shadow-glow" : "border-border hover:border-primary"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Category;
