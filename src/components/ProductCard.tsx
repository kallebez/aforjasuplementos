import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  return (
    <div
      className="card-product group animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 gradient-primary text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-glow">
          {product.badge}
        </span>
      )}
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-md">
          -{discount}%
        </span>
      )}
      <Link to={`/produto/${product.id}`} className="block">
        <div className="aspect-square bg-muted overflow-hidden flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="text-muted-foreground text-sm">Sem imagem</div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
            />
          ))}
          <span>({product.rating_count})</span>
        </div>
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        <div className="space-y-0.5">
          {product.old_price && (
            <div className="text-xs text-muted-foreground line-through">{formatBRL(product.old_price)}</div>
          )}
          <div className="text-xl font-bold text-primary">{formatBRL(product.price)}</div>
          <div className="text-[11px] text-muted-foreground">
            ou 12x de {formatBRL(product.price / 12)}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="w-full mt-2 gradient-primary text-white font-semibold text-sm h-11 rounded-xl flex items-center justify-center gap-2 hover:shadow-glow transition-all active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
