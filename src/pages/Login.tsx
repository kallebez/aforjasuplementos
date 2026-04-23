import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, ArrowLeft, Sparkles, ShieldCheck, Truck, Tag } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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

  const benefits = [
    { icon: Tag, text: "Cupons exclusivos para membros" },
    { icon: Truck, text: "Frete grátis acima de R$ 199" },
    { icon: ShieldCheck, text: "Checkout seguro e rápido" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] gradient-primary rounded-full opacity-30 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-accent/40 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/20 rounded-full opacity-40 blur-3xl animate-pulse-glow" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back to store */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium glass rounded-full px-4 py-2 transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a loja
      </Link>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Brand mark */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-white/90 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
              <span>Aforja Suplementos</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-2 tracking-tight">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-white/60 text-sm">
              {mode === "login"
                ? "Entre para continuar sua jornada de evolução."
                : "Junte-se a milhares de atletas que confiam na Aforja."}
            </p>
          </div>

          {/* Glassmorphism card */}
          <div className="glass rounded-3xl p-7 md:p-8 shadow-2xl border border-white/10 backdrop-blur-2xl">
            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white text-gray-800 hover:bg-white/95 transition-all text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continuar com Google
            </button>

            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/40 my-6">
              <div className="flex-1 h-px bg-white/15" />
              ou com email
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5 animate-fade-in-up">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">Nome completo</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary-glow transition-colors" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-3 h-12 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-glow focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary-glow transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-3 h-12 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-glow focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/80 uppercase tracking-wide">Senha</label>
                  {mode === "login" && (
                    <button type="button" className="text-[11px] text-primary-glow hover:underline">
                      Esqueceu?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary-glow transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-16 h-12 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-glow focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/50 hover:text-white px-2 py-1"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white font-semibold h-12 rounded-xl hover:shadow-glow transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] mt-2"
              >
                {loading ? "Aguarde..." : mode === "login" ? "Entrar agora" : "Criar minha conta"}
              </button>
            </form>

            <div className="text-sm text-center text-white/60 mt-6">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary-glow font-semibold hover:underline"
              >
                {mode === "login" ? "Cadastre-se grátis" : "Entrar"}
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="glass rounded-2xl p-3 text-center border border-white/5 hover:border-white/15 transition-colors"
              >
                <b.icon className="w-4 h-4 text-primary-glow mx-auto mb-1.5" />
                <p className="text-[10px] text-white/70 leading-tight">{b.text}</p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-white/40 text-center mt-6">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-white/60">Termos</a> e{" "}
            <a href="#" className="underline hover:text-white/60">Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
