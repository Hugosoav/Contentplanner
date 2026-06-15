import { CalendarDays, LayoutGrid, Lightbulb, BarChart3, Settings, Sparkles, PlusCircle, ChevronDown, Trash2, LogOut, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { pillarLabels, pillarColors, type ContentPillar } from "@/lib/content-data";
import { type ClientProfile } from "@/lib/client-data";
import { useState } from "react";
import sincroLogoFull from "@/assets/sincro-logo-full.png.asset.json";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  clients: ClientProfile[];
  selectedClient: ClientProfile | null;
  onSelectClient: (client: ClientProfile) => void;
  onNewClient: () => void;
  onDeleteClient: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: "calendar", label: "Calendário", icon: CalendarDays },
  { id: "board", label: "Quadro", icon: LayoutGrid },
  { id: "ai", label: "Sugestões IA", icon: Sparkles },
  { id: "ideas", label: "Ideias", icon: Lightbulb },
  { id: "analytics", label: "Métricas", icon: BarChart3 },
];

const pillars: ContentPillar[] = ["educativo", "autoridade", "engajamento", "vendas", "bastidores"];

const AppSidebar = ({ activeView, onViewChange, clients, selectedClient, onSelectClient, onNewClient, onDeleteClient, isOpen = false, onClose }: SidebarProps) => {
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleNav = (view: string) => {
    onViewChange(view);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border overflow-hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
      {/* Brand */}
      <div className="relative p-6 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={sincroLogoFull.url} alt="Sincro" className="h-7 w-auto" />
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
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
      <nav className="relative p-4 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mb-3 px-3">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.25)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                {activeView === item.id && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-accent" />
                )}
                <item.icon className={`w-4 h-4 ${activeView === item.id ? "text-accent" : ""}`} />
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

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="w-4 h-4" />
          Configurações
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
      </aside>
    </>
  );
};

export default AppSidebar;
