import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import sincroLogoWhite from "@/assets/sincro-logo-white.png.asset.json";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Parâmetro authorization_id ausente.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um redirecionamento.");
      return;
    }
    window.location.href = target;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <img src={sincroLogoWhite.url} alt="Sincro" className="h-7 w-auto mb-8" />
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-foreground mb-2">Não foi possível concluir</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Carregando pedido de autorização…
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Conectar {details.client?.name ?? "aplicativo"} à sua conta
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {details.client?.name ?? "Este aplicativo"} poderá ler e criar conteúdos e ideias dos seus
              dashboards no Sincro, agindo como você.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => decide(true)} disabled={busy} className="flex-1">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Autorizar
              </Button>
              <Button variant="outline" onClick={() => decide(false)} disabled={busy} className="flex-1">
                Recusar
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
