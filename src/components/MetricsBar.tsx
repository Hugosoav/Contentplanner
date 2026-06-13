import { type ContentItem, statusLabels, type ContentStatus } from "@/lib/content-data";
import { FileText, Calendar, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";

interface MetricsBarProps {
  items: ContentItem[];
}

const MetricsBar = ({ items }: MetricsBarProps) => {
  const counts: Record<ContentStatus, number> = { draft: 0, scheduled: 0, published: 0, idea: 0 };
  items.forEach((c) => counts[c.status]++);

  const metrics = [
    { label: "Total", value: items.length, icon: FileText, color: "text-accent", highlight: true },
    { label: "Publicados", value: counts.published, icon: CheckCircle2, color: "text-success" },
    { label: "Agendados", value: counts.scheduled, icon: Calendar, color: "text-info" },
    { label: "Rascunhos", value: counts.draft, icon: TrendingUp, color: "text-warning" },
    { label: "Ideias", value: counts.idea, icon: Lightbulb, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`relative overflow-hidden bg-card rounded-xl border p-4 animate-fade-in transition-colors ${
            m.highlight ? "border-accent/40" : "border-border hover:border-accent/30"
          }`}
        >
          {m.highlight && (
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-accent/20 blur-2xl" />
          )}
          <div className="relative flex items-center justify-between mb-2">
            <m.icon className={`w-4 h-4 ${m.color}`} />
            <span className={`text-2xl font-bold font-heading ${m.color}`}>{m.value}</span>
          </div>
          <p className="relative text-xs text-muted-foreground font-medium">{m.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;
