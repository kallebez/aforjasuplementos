import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? "/admin" : redirect, { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Bem-vindo.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Erro no login com Google");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12 grid md:grid-cols-2 max-w-5xl gap-0 bg-card rounded-3xl shadow-md-custom overflow-hidden border border-border my-10">
        <div className="gradient-hero text-white p-10 hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 gradient-primary rounded-full opacity-30 blur-3xl animate-float" />
          <div className="relative">
            <div className="inline-block glass rounded-full px-3 py-1 text-xs mb-6">⚡ Acesso rápido</div>
            <h2 className="font-display text-4xl mb-3">Bem-vindo à<br />Aforja</h2>
            <p className="text-white/70 text-sm leading-relaxed">Acesse para ofertas exclusivas, cupons e acompanhamento de pedidos.</p>
          </div>
          <div className="relative space-y-3 text-sm">
            {["Checkout mais rápido", "Cupons exclusivos", "Histórico de pedidos"].map((p) => (
              <div key={p} className="flex items-center gap-2"><span className="text-primary-glow">✓</span>{p}</div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-5">
          <div>
            <h1 className="font-display text-3xl">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Acesse sua conta para continuar." : "Cadastre-se para aproveitar ofertas."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> ou <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Nome completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-muted border border-border rounded-lg pl-10 pr-3 h-11 text-sm outline-none focus:border-primary" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-muted border border-border rounded-lg pl-10 pr-3 h-11 text-sm outline-none focus:border-primary" placeholder="seu@email.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-muted border border-border rounded-lg pl-10 pr-3 h-11 text-sm outline-none focus:border-primary" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full gradient-primary text-white font-semibold h-11 rounded-xl hover:shadow-glow transition-all disabled:opacity-60">
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <div className="text-sm text-center text-muted-foreground">
            {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </div>

          <Link to="/" className="block text-xs text-muted-foreground text-center hover:text-primary">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
