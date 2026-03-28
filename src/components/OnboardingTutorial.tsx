import { useState } from "react";
import { CalendarDays, LayoutGrid, Sparkles, Lightbulb, BarChart3, PlusCircle, X, ChevronRight, ChevronLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingTutorialProps {
  onComplete: () => void;
  onCreateClient: () => void;
}

const steps = [
  {
    icon: Rocket,
    title: "Bem-vindo ao ContentPlan!",
    description: "Sua plataforma de planejamento estratégico de conteúdo mensal. Vamos te mostrar como usar cada recurso em poucos passos.",
    tip: "Clique em \"Próximo\" para continuar o tour.",
  },
  {
    icon: PlusCircle,
    title: "Crie seu primeiro Dashboard",
    description: "Cada cliente ou projeto tem seu próprio dashboard. Clique em \"+ Novo Dashboard\" no menu lateral para começar. Preencha a área de atuação, objetivos, tom de voz e público-alvo.",
    tip: "Quanto mais detalhes você preencher, melhores serão as sugestões da IA.",
  },
  {
    icon: CalendarDays,
    title: "Calendário de Conteúdo",
    description: "Visualize todo o seu planejamento mensal no calendário. Use o botão \"Novo Conteúdo\" para agendar posts. Você pode mover conteúdos para outras datas clicando no ícone de calendário em cada card.",
    tip: "Organize seus posts por data para manter a consistência nas publicações.",
  },
  {
    icon: LayoutGrid,
    title: "Quadro Kanban",
    description: "Acompanhe o status de cada conteúdo no formato de quadro: Planejado, Em Produção, Em Revisão e Publicado. Edite ou remova conteúdos diretamente pelos cards.",
    tip: "Use o quadro para gerenciar o fluxo de produção da sua equipe.",
  },
  {
    icon: Sparkles,
    title: "Sugestões com IA",
    description: "A inteligência artificial analisa o perfil do cliente (área, objetivos, tom de voz e público) e gera 8 sugestões estratégicas de conteúdo. Cada sugestão inclui título, hook, plataforma e data sugerida.",
    tip: "As sugestões nunca se repetem! Você pode adicioná-las ao calendário ou salvá-las no banco de ideias.",
  },
  {
    icon: Lightbulb,
    title: "Banco de Ideias",
    description: "Salve sugestões da IA que você gostou mas ainda não quer agendar. É seu repositório de inspiração para futuras campanhas e conteúdos.",
    tip: "Use o ícone de lâmpada nas sugestões da IA para mover ideias para cá.",
  },
  {
    icon: BarChart3,
    title: "Métricas",
    description: "Acompanhe o panorama do seu planejamento: total de conteúdos, status de produção e distribuição por pilares (educativo, autoridade, engajamento, vendas e bastidores).",
    tip: "A barra de métricas no topo se atualiza automaticamente conforme você adiciona conteúdos.",
  },
];

const OnboardingTutorial = ({ onComplete, onCreateClient }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm px-4">
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-accent" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {step.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
            <p className="text-xs text-accent font-medium">💡 {step.tip}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-accent" : i < currentStep ? "w-1.5 bg-accent/50" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {isLast ? (
            <Button
              size="sm"
              onClick={() => {
                onComplete();
                onCreateClient();
              }}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <PlusCircle className="w-4 h-4" />
              Criar meu primeiro Dashboard
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
