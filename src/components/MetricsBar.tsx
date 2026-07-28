import { type ContentItem, type ContentStatus } from "@/lib/content-data";

interface MetricsBarProps {
  items: ContentItem[];
}

const MetricsBar = ({ items }: MetricsBarProps) => {
  const counts: Record<ContentStatus, number> = { draft: 0, scheduled: 0, published: 0, idea: 0 };
  items.forEach((c) => counts[c.status]++);

  const metrics = [
    { label: "Total", value: items.length, dot: "bg-foreground/40" },
    { label: "Publicados", value: counts.published, dot: "bg-emerald-500/70" },
    { label: "Agendados", value: counts.scheduled, dot: "bg-sky-500/70" },
    { label: "Rascunhos", value: counts.draft, dot: "bg-muted-foreground/50" },
    { label: "Ideias", value: counts.idea, dot: "bg-amber-500/70" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-border rounded-lg overflow-hidden border border-border mb-6 sm:mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="bg-background px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{m.label}</p>
          </div>
          <p className="text-2xl font-semibold text-foreground tabular-nums">{m.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;
