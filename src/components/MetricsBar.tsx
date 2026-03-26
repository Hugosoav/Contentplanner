import { sampleContent, statusLabels, pillarLabels, type ContentStatus, type ContentPillar } from "@/lib/content-data";
import { FileText, Calendar, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";

const MetricsBar = () => {
  const counts: Record<ContentStatus, number> = { draft: 0, scheduled: 0, published: 0, idea: 0 };
  sampleContent.forEach((c) => counts[c.status]++);

  const pillarCounts: Record<ContentPillar, number> = { educativo: 0, autoridade: 0, engajamento: 0, vendas: 0, bastidores: 0 };
  sampleContent.forEach((c) => pillarCounts[c.pillar]++);

  const metrics = [
    { label: "Total", value: sampleContent.length, icon: FileText, color: "text-foreground" },
    { label: "Publicados", value: counts.published, icon: CheckCircle2, color: "text-success" },
    { label: "Agendados", value: counts.scheduled, icon: Calendar, color: "text-info" },
    { label: "Rascunhos", value: counts.draft, icon: TrendingUp, color: "text-warning" },
    { label: "Ideias", value: counts.idea, icon: Lightbulb, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-xl border border-border p-4 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <m.icon className={`w-4 h-4 ${m.color}`} />
            <span className={`text-2xl font-bold font-heading ${m.color}`}>{m.value}</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;
