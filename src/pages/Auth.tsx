import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Loader2, Check, Menu } from "lucide-react";
import sincroLogoWhite from "@/assets/sincro-logo-white.png.asset.json";
import sincroBgAurora from "@/assets/sincro-bg-aurora.png.asset.json";
import previewCalendar from "@/assets/sincro-preview-calendar.png.asset.json";
import previewBoard from "@/assets/sincro-preview-board.png.asset.json";
import previewAI from "@/assets/sincro-preview-ai.png.asset.json";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

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

  const navItems: { id: string; label: string }[] = [
    { id: "faq", label: "FAQ" },
    { id: "planos", label: "PLANOS" },
    { id: "sobre", label: "SOBRE" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const plans = [
    {
      name: "Starter",
      price: "R$ 0",
      period: "/mês",
      desc: "Para começar a organizar seu conteúdo.",
      features: ["1 cliente", "Calendário editorial", "Banco de ideias", "5 sugestões IA / mês"],
      cta: "Começar grátis",
    },
    {
      name: "Pro",
      price: "R$ 79",
      period: "/mês",
      desc: "Para criadores e estrategistas em ritmo.",
      features: ["10 clientes", "Sugestões IA ilimitadas", "Quadro + Calendário", "Exportação de pautas"],
      cta: "Assinar Pro",
      highlight: true,
    },
    {
      name: "Agência",
      price: "R$ 199",
      period: "/mês",
      desc: "Para agências com múltiplas marcas.",
      features: ["Clientes ilimitados", "Multi-usuário", "Suporte prioritário", "Branding personalizado"],
      cta: "Falar com vendas",
    },
  ];

  const faqs = [
    { q: "Como funciona a Sincro?", a: "A Sincro centraliza planejamento, calendário editorial e sugestões de IA em um único fluxo, permitindo gerenciar múltiplos clientes em dashboards isolados." },
    { q: "Preciso de cartão para começar?", a: "Não. O plano Starter é gratuito e não exige cartão de crédito." },
    { q: "Como a IA gera sugestões?", a: "Usamos modelos de linguagem treinados para criar pautas, títulos e ideias adaptadas ao posicionamento de cada cliente cadastrado." },
    { q: "Posso cancelar a qualquer momento?", a: "Sim. Você pode cancelar ou trocar de plano diretamente nas configurações da conta." },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* HERO wrapper with aurora background */}
      <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={sincroBgAurora.url}
          alt=""
          aria-hidden
          className="aurora-pan absolute inset-0 h-full w-full object-cover"
        />
      </div>
      {/* Saturated color washes for extra punch */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className="aurora-glow absolute -top-40 right-[-10%] h-[60rem] w-[60rem] rounded-full bg-[#ff5a1f] opacity-60 blur-[160px]" />
        <div className="aurora-glow absolute top-1/3 right-0 h-[40rem] w-[40rem] rounded-full bg-[#ffb347] opacity-50 blur-[140px]" style={{ animationDelay: "-3s" }} />
        <div className="aurora-glow absolute bottom-[-20%] right-1/4 h-[36rem] w-[36rem] rounded-full bg-[#e91e63] opacity-30 blur-[160px]" style={{ animationDelay: "-6s" }} />
      </div>
      {/* Left fade for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 via-30% to-transparent" />
      {/* Fade to black at the bottom for smooth transition into the dark section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-black" />
      {/* Subtle grain */}
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-12">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center">
          <img src={sincroLogoWhite.url} alt="Sincro" className="h-8 w-auto" />
        </button>
        <nav className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.25em] text-white/70 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setAuthOpen(true)}
            className="rounded-full border border-white/20 px-5 py-2 text-[11px] tracking-[0.25em] text-white transition-colors hover:bg-white/10"
          >
            ENTRAR
          </button>
        </nav>
        <button
          className="md:hidden text-white/80"
          onClick={() => setMobileNav((v) => !v)}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="relative z-20 mx-6 mb-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { scrollTo(item.id); setMobileNav(false); }}
              className="text-left text-sm uppercase tracking-[0.2em] text-white/80"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setAuthOpen(true); setMobileNav(false); }}
            className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white"
          >
            Entrar
          </button>
        </div>
      )}

      {/* HERO */}
      <main className="relative z-10 px-6 pb-32 pt-6 lg:px-16">
          <section className="grid min-h-[calc(100vh-12rem)] grid-cols-1 items-center">
            <div className="max-w-3xl">
              <h1 className="font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                Para gestores<br />
                e criadores<br />
                de conteúdo
              </h1>
              <p className="mt-8 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                Planejamento, criatividade, gestão e inteligência artificial trabalhando em perfeita sincronia para transformar ideias em conteúdo, conteúdo em estratégia e estratégia em resultados. Menos processos dispersos e mais clareza, velocidade e crescimento.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => setAuthOpen(true)}
                  className="h-12 rounded-full bg-white px-8 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-white/90"
                >
                  Começar agora
                </Button>
                <button
                  onClick={() => scrollTo("sobre")}
                  className="text-xs uppercase tracking-[0.25em] text-white/60 hover:text-white"
                >
                  Saiba mais →
                </button>
              </div>
              <div className="mt-16 flex items-center gap-2 text-white/40">
                <span className="h-px w-8 bg-white/40" />
                <span className="h-px w-8 bg-white/40" />
                <span className="h-px w-8 bg-white/40" />
              </div>
            </div>
          </section>
      </main>
      </div>

      {/* DARK CONTENT — Sobre, Planos, FAQ combinados */}
      <div className="relative bg-black">
        {/* Subtle radial vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,84,15,0.08),transparent_60%)]" />
        {/* Faint grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 px-6 py-24 lg:px-16">
          {/* SOBRE */}
          <section id="sobre" className="mx-auto max-w-6xl space-y-24 scroll-mt-24">
            {/* Intro */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">Sobre</span>
              <h2 className="mt-4 font-heading text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
                Sincronia entre <span className="text-gradient-brand">estratégia</span> e criação.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
                A Sincro nasceu para resolver o caos do conteúdo. Reunimos planejamento, calendário editorial, banco de ideias e inteligência artificial em uma única plataforma — para que estrategistas, criadores e agências possam focar no que realmente importa: criar.
              </p>
            </div>

            {/* For whom */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">Para quem</span>
              <h3 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
                Feita para <span className="text-gradient-brand">agências</span> e <span className="text-gradient-brand">influenciadores</span>.
              </h3>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#f2540f]">Agências de marketing</span>
                  <h4 className="mt-3 text-2xl font-semibold text-white">Gerencie múltiplas marcas sem se perder</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Dashboards isolados por cliente, calendário editorial compartilhado com o time e sugestões de IA calibradas para cada posicionamento. Escale a operação sem multiplicar planilhas.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-white/80">
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Múltiplos clientes em contas separadas</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Fluxo de aprovação e status por conteúdo</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Pautas geradas com base no briefing</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#f2540f]">Influenciadores e criadores</span>
                  <h4 className="mt-3 text-2xl font-semibold text-white">Constância criativa sem travar no branco</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Banco de ideias sempre cheio, calendário visual para nunca perder o ritmo e ganchos prontos para reels, carrosséis e stories. Mais criação, menos improviso.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-white/80">
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Ideias organizadas por pilar de conteúdo</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Sugestões de IA com tom de voz próprio</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />Calendário e quadro em uma tela só</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Platform preview */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">A plataforma</span>
              <h3 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
                Tudo em um só <span className="text-gradient-brand">fluxo</span>.
              </h3>

              <div className="mt-12 space-y-16">
                {[
                  {
                    tag: "Calendário editorial",
                    title: "Planeje o mês inteiro em uma visão só",
                    desc: "Enxergue publicações, agendamentos e rascunhos por semana. Arraste para reagendar e mantenha o time alinhado com o cliente.",
                    img: previewCalendar.url,
                  },
                  {
                    tag: "Quadro de conteúdos",
                    title: "Do rascunho ao publicado, sem fricção",
                    desc: "Kanban com estágios de Ideia, Rascunho, Agendado e Publicado. Acompanhe o status de cada peça sem sair da tela.",
                    img: previewBoard.url,
                    reverse: true,
                  },
                  {
                    tag: "Sugestões de IA",
                    title: "Ideias novas com o tom da marca",
                    desc: "A IA lê o posicionamento, público-alvo e objetivos do cliente para sugerir pautas prontas — com gancho, formato e data recomendados.",
                    img: previewAI.url,
                  },
                ].map((f) => (
                  <div key={f.tag} className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 ${f.reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#f2540f]">{f.tag}</span>
                      <h4 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{f.title}</h4>
                      <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{f.desc}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" />
                      <img
                        src={f.img}
                        alt={f.title}
                        loading="lazy"
                        className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PLANOS */}
          <section id="planos" className="mx-auto mt-32 max-w-6xl scroll-mt-24">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">Planos</span>
            <h2 className="mt-4 font-heading text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
              Escolha o ritmo da<br />sua <span className="text-gradient-brand">operação</span>.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`relative rounded-2xl border p-8 backdrop-blur-xl ${p.highlight ? "border-[#f2540f]/60 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]"}`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-6 rounded-full bg-gradient-brand px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                      Mais popular
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{p.price}</span>
                    <span className="text-sm text-white/50">{p.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/60">{p.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="mt-0.5 h-4 w-4 text-[#f2540f]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setAuthOpen(true)}
                    className={`mt-8 w-full rounded-full ${p.highlight ? "bg-gradient-brand text-white" : "bg-white text-black hover:bg-white/90"}`}
                  >
                    {p.cta}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto mt-32 max-w-3xl scroll-mt-24">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">FAQ</span>
            <h2 className="mt-4 font-heading text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
              Perguntas <span className="text-gradient-brand">frequentes</span>.
            </h2>
            <Accordion type="single" collapsible className="mt-10">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-base text-white hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-white/60">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA final */}
          <div className="mx-auto mt-32 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl sm:p-14">
            <h3 className="font-heading text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
              Pronto para <span className="text-gradient-brand">sincronizar</span>?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
              Comece grátis, sem cartão. Em minutos você já tem o primeiro cliente e as primeiras pautas prontas.
            </p>
            <Button
              onClick={() => setAuthOpen(true)}
              className="mt-8 h-12 rounded-full bg-white px-8 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-white/90"
            >
              Criar minha conta
            </Button>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-w-md border-white/10 bg-[#0a0a0a]/95 p-0 text-white backdrop-blur-2xl">
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-white">Acesse a plataforma</DialogTitle>
            </DialogHeader>
            <p className="mt-1 text-sm text-white/50">Entre ou crie sua conta para começar.</p>

            <div className="mt-6 space-y-4">
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
                      <Input id="login-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white/80">Senha</Label>
                      <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
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
                      <Input id="signup-name" type="text" placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white/80">E-mail</Label>
                      <Input id="signup-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white/80">Senha</Label>
                      <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-gradient-brand hover:opacity-90 text-white border-0" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
