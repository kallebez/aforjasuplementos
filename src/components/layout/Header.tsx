import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Search, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CATEGORIES } from "@/lib/types";
import { useState } from "react";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/categoria?busca=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="px-8">🚚 FRETE GRÁTIS acima de R$199</span>
          <span className="px-8">
            🎟️ CUPOM <strong>GAB10</strong> para 10% OFF
          </span>
          <span className="px-8">💳 Aceitamos a ELI como pagamento</span>
          <span className="px-8">⚡ Entrega expressa para a safada da ELI</span>
          <span className="px-8">🚚 FRETE GRÁTIS se a ELI der</span>
          <span className="px-8">
            🎟️ CUPOM <strong>GAB10</strong> para 10% OFF
          </span>
          <span className="px-8">💳 PARCELE em até 12x sem juros</span>
          <span className="px-8">⚡ Entrega expressa para todo o Brasil</span>
        </div>
      </div>

      {/* Main */}
      <div className="glass-dark">
        <div className="container flex items-center gap-4 h-20">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <img
                src="/logo.png"
                alt="Aforja"
                className="w-7 h-7 object-contain drop-shadow-sm"
                width={28}
                height={28}
              />
            </div>
            <div className="text-white leading-tight">
              <div className="font-display text-xl tracking-wider">AFORJA</div>
              <div className="text-[9px] tracking-[0.2em] text-primary-glow font-semibold -mt-0.5">SUPLEMENTOS</div>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 h-11 border border-white/10"
          >
            <Search className="w-4 h-4 text-white/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar whey, creatina, pré-treino..."
              className="flex-1 bg-transparent border-0 outline-0 text-sm text-white placeholder:text-white/40"
            />
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 px-3 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary-glow hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/conta"
                  className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  Conta
                </Link>
                <button
                  onClick={signOut}
                  className="hidden sm:flex items-center gap-1.5 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
              >
                <User className="w-4 h-4" />
                Entrar
              </Link>
            )}
            <Link
              to="/carrinho"
              className="relative flex items-center gap-2 px-4 h-10 rounded-xl gradient-primary text-white text-sm font-semibold shadow-glow hover:shadow-intense transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-scale-in">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className={`${open ? "block" : "hidden md:block"} border-t border-white/5`}>
          <div className="container flex flex-col md:flex-row md:items-center gap-1 md:gap-2 py-2 overflow-x-auto scrollbar-hide">
            <RouterNavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "gradient-primary text-white shadow-glow"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Ofertas
            </RouterNavLink>
            {CATEGORIES.map((c) => (
              <RouterNavLink
                key={c}
                to={`/categoria?cat=${encodeURIComponent(c)}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "gradient-primary text-white shadow-glow"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {c}
              </RouterNavLink>
            ))}
            <RouterNavLink
              to="/combos"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "gradient-primary text-white shadow-glow"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Combos
            </RouterNavLink>
            <RouterNavLink
              to="/blog"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "gradient-primary text-white shadow-glow"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              Blog
            </RouterNavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
