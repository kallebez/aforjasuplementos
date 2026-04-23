import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } },
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
          setErrorMsg(data?.error || "Token inválido ou expirado");
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid === true) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch (e: any) {
        setStatus("invalid");
        setErrorMsg(e.message || "Erro ao validar link");
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || "Não foi possível processar");
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Erro ao processar");
    }
  };

  return (
    <Layout>
      <div className="container py-16 max-w-lg">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-md-custom text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-primary flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {status === "loading" && (
            <>
              <h1 className="font-display text-2xl mb-2">Validando link…</h1>
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mt-4" />
            </>
          )}

          {status === "valid" && (
            <>
              <h1 className="font-display text-2xl mb-2">Cancelar inscrição</h1>
              <p className="text-muted-foreground text-sm mb-6">
                Confirme abaixo para parar de receber emails da Aforja Suplementos neste endereço.
              </p>
              <button
                onClick={handleConfirm}
                className="w-full gradient-primary text-white font-semibold h-12 rounded-xl hover:shadow-glow transition-all"
              >
                Confirmar cancelamento
              </button>
              <Link to="/" className="block text-xs text-muted-foreground mt-4 hover:text-primary">
                Mudei de ideia, voltar à loja
              </Link>
            </>
          )}

          {status === "submitting" && (
            <>
              <h1 className="font-display text-2xl mb-2">Processando…</h1>
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mt-4" />
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              <h1 className="font-display text-2xl mb-2">Pronto!</h1>
              <p className="text-muted-foreground text-sm mb-6">
                Você não receberá mais emails neste endereço. Sentiremos sua falta!
              </p>
              <Link
                to="/"
                className="inline-block gradient-primary text-white font-semibold px-6 h-11 leading-[2.75rem] rounded-xl hover:shadow-glow transition-all"
              >
                Voltar à loja
              </Link>
            </>
          )}

          {status === "already" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h1 className="font-display text-2xl mb-2">Já cancelado</h1>
              <p className="text-muted-foreground text-sm mb-6">
                Este email já foi removido da nossa lista anteriormente.
              </p>
              <Link
                to="/"
                className="inline-block gradient-primary text-white font-semibold px-6 h-11 leading-[2.75rem] rounded-xl hover:shadow-glow transition-all"
              >
                Voltar à loja
              </Link>
            </>
          )}

          {(status === "invalid" || status === "error") && (
            <>
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <h1 className="font-display text-2xl mb-2">Link inválido</h1>
              <p className="text-muted-foreground text-sm mb-2">
                {errorMsg || "Este link de cancelamento é inválido ou expirou."}
              </p>
              <Link
                to="/"
                className="inline-block mt-4 gradient-primary text-white font-semibold px-6 h-11 leading-[2.75rem] rounded-xl hover:shadow-glow transition-all"
              >
                Voltar à loja
              </Link>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Unsubscribe;
