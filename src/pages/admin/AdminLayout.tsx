import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingBag, LogOut, Home, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const links = [
    { to: "/admin", label: "Dashboard", icon: Shield, end: true },
    { to: "/admin/produtos", label: "Produtos", icon: Package },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className="w-64 bg-secondary text-white flex flex-col shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5 p-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg leading-none">AFORJA</div>
            <div className="text-[10px] tracking-widest text-primary-glow font-bold">ADMIN PANEL</div>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 h-11 rounded-xl text-sm transition-all ${
                  isActive ? "gradient-primary text-white shadow-glow" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 h-10 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white">
            <Home className="w-4 h-4" /> Ver loja
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white">
            <LogOut className="w-4 h-4" /> Sair
          </button>
          <div className="text-xs text-white/40 px-3 pt-2 truncate">{user.email}</div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
