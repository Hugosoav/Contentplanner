import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import sincroLogoFull from "@/assets/sincro-logo-full.png.asset.json";
import sincroMark from "@/assets/sincro-mark.png.asset.json";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<"entrar" | "sobre">("entrar");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/", { replace: true });
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verifique seu e-mail para confirmar a conta!");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Erro ao conectar com Google");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#e91e63] opacity-20 blur-[140px]" />
        <div className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-[#f2540f] opacity-20 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#f5a623] opacity-10 blur-[140px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <img src={sincroLogoFull.url} alt="Sincro" className="h-7 w-auto" />
        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-white/60 md:flex">
          <button
            onClick={() => setActiveTab("entrar")}
            className={`transition-colors hover:text-white ${activeTab === "entrar" ? "text-white" : ""}`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab("sobre")}
            className={`transition-colors hover:text-white ${activeTab === "sobre" ? "text-white" : ""}`}
          >
            Sobre
          </button>
        </nav>
      </header>

      {/* Main grid */}
      <main className="relative z-10 grid min-h-[calc(100vh-7rem)] grid-cols-1 items-center gap-16 px-6 pb-16 lg:grid-cols-2 lg:gap-8 lg:px-16">
        {/* Hero copy */}
        <div className="max-w-xl space-y-8">
          <div className="flex items-center gap-4">
            <img src={sincroMark.url} alt="" className="h-14 w-14" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/40">
              Planejamento de Conteúdo
            </span>
          </div>
          {activeTab === "entrar" ? (
            <>
              <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Sincronize sua marca<br />
                com o que{" "}
                <span className="text-gradient-brand">importa.</span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                A plataforma que conecta planejamento estratégico, IA e calendário editorial em um só lugar.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Sobre a <span className="text-gradient-brand">Sincro</span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/70">
                Somos uma plataforma criada para estrategistas de conteúdo, agências e criadores que precisam organizar pautas, calendários e ideias em um fluxo único — potencializado por inteligência artificial.
              </p>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex gap-3"><span className="text-gradient-brand">→</span> Gestão multi-cliente com isolamento total</li>
                <li className="flex gap-3"><span className="text-gradient-brand">→</span> Sugestões de conteúdo geradas por IA</li>
                <li className="flex gap-3"><span className="text-gradient-brand">→</span> Calendário e quadro editorial integrados</li>
                <li className="flex gap-3"><span className="text-gradient-brand">→</span> Banco de ideias persistente por cliente</li>
              </ul>
            </>
          )}
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Acesse a plataforma</h2>
              <p className="text-sm text-white/50">Entre ou crie sua conta para começar.</p>
            </div>

            <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11 gap-3 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </Button>

            <div className="relative">
              <Separator className="bg-white/10" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-3 text-xs uppercase tracking-wider text-white/40">
                ou com e-mail
              </span>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="login" className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white/80">E-mail</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white/80">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-brand hover:opacity-90 text-white border-0" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white/80">Nome completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white/80">E-mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white/80">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-brand hover:opacity-90 text-white border-0" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            </div>

            <p className="mt-6 text-center text-xs text-white/40">
              Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade da Sincro.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
