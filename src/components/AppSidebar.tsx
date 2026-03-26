import { CalendarDays, LayoutGrid, Lightbulb, BarChart3, Settings, Plus, Zap } from "lucide-react";
import { pillarLabels, pillarColors, type ContentPillar } from "@/lib/content-data";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "calendar", label: "Calendário", icon: CalendarDays },
  { id: "board", label: "Quadro", icon: LayoutGrid },
  { id: "ideas", label: "Ideias", icon: Lightbulb },
  { id: "analytics", label: "Métricas", icon: BarChart3 },
];

const pillars: ContentPillar[] = ["educativo", "autoridade", "engajamento", "vendas", "bastidores"];

const AppSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-lg text-sidebar-accent-foreground leading-none">ContentFlow</h1>
            <p className="text-xs text-sidebar-foreground mt-0.5">Planejamento Estratégico</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mb-3 px-3">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Pillars */}
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mb-3 px-3 mt-8">Pilares</p>
        <ul className="space-y-1">
          {pillars.map((pillar) => (
            <li key={pillar} className="flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground">
              <span className={`w-2.5 h-2.5 rounded-full ${pillarColors[pillar]}`} />
              {pillarLabels[pillar]}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
