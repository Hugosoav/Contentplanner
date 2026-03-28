import { CalendarDays, LayoutGrid, Lightbulb, BarChart3, Settings, Zap, Sparkles, PlusCircle, ChevronDown, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { pillarLabels, pillarColors, type ContentPillar } from "@/lib/content-data";
import { type ClientProfile } from "@/lib/client-data";
import { useState } from "react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  clients: ClientProfile[];
  selectedClient: ClientProfile | null;
  onSelectClient: (client: ClientProfile) => void;
  onNewClient: () => void;
  onDeleteClient: (id: string) => void;
}

const navItems = [
  { id: "calendar", label: "Calendário", icon: CalendarDays },
  { id: "board", label: "Quadro", icon: LayoutGrid },
  { id: "ai", label: "Sugestões IA", icon: Sparkles },
  { id: "ideas", label: "Ideias", icon: Lightbulb },
  { id: "analytics", label: "Métricas", icon: BarChart3 },
];

const pillars: ContentPillar[] = ["educativo", "autoridade", "engajamento", "vendas", "bastidores"];

const AppSidebar = ({ activeView, onViewChange, clients, selectedClient, onSelectClient, onNewClient, onDeleteClient }: SidebarProps) => {
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

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

      {/* Client Selector */}
      <div className="p-4 border-b border-sidebar-border">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mb-2 px-1">Cliente</p>
        <div className="relative">
          <button
            onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium transition-colors hover:bg-sidebar-accent/80"
          >
            <span className="truncate">{selectedClient?.name || "Selecionar cliente"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${clientDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {clientDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-sidebar-accent rounded-lg border border-sidebar-border shadow-xl z-20 overflow-hidden">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between transition-colors ${
                    selectedClient?.id === c.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-accent-foreground hover:bg-sidebar-border"
                  }`}
                >
                  <button
                    onClick={() => { onSelectClient(c); setClientDropdownOpen(false); }}
                    className="flex-1 text-left px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="block text-[10px] opacity-70">{c.area}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteClient(c.id); setClientDropdownOpen(false); }}
                    className="px-2 py-2.5 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remover dashboard"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => { onNewClient(); setClientDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-sidebar-primary hover:bg-sidebar-border transition-colors border-t border-sidebar-border"
              >
                <PlusCircle className="w-4 h-4" />
                Novo Dashboard
              </button>
            </div>
          )}
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
