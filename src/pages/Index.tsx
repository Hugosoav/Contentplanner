import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import ContentCalendar from "@/components/ContentCalendar";
import MetricsBar from "@/components/MetricsBar";
import ContentBoard from "@/components/ContentBoard";
import AISuggestions from "@/components/AISuggestions";
import NewClientModal from "@/components/NewClientModal";
import { sampleClients, type ClientProfile } from "@/lib/client-data";
import { Plus, Search } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [clients, setClients] = useState<ClientProfile[]>(sampleClients);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(sampleClients[0]);
  const [showNewClient, setShowNewClient] = useState(false);

  const handleNewClient = (client: ClientProfile) => {
    setClients((prev) => [...prev, client]);
    setSelectedClient(client);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
        onNewClient={() => setShowNewClient(true)}
      />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar conteúdos..."
                className="pl-10 pr-4 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 w-72"
              />
            </div>
            <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Novo Conteúdo
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <MetricsBar />

          {activeView === "calendar" && <ContentCalendar />}
          {activeView === "board" && <ContentBoard />}
          {activeView === "ai" && selectedClient && <AISuggestions client={selectedClient} />}
          {activeView === "ideas" && (
            <div className="text-center py-20">
              <h2 className="font-heading text-2xl text-foreground mb-2">Banco de Ideias</h2>
              <p className="text-muted-foreground text-sm">Capture e organize suas ideias de conteúdo aqui.</p>
            </div>
          )}
          {activeView === "analytics" && (
            <div className="text-center py-20">
              <h2 className="font-heading text-2xl text-foreground mb-2">Métricas e Relatórios</h2>
              <p className="text-muted-foreground text-sm">Acompanhe o desempenho do seu conteúdo.</p>
            </div>
          )}
        </div>
      </main>

      <NewClientModal isOpen={showNewClient} onClose={() => setShowNewClient(false)} onSave={handleNewClient} />
    </div>
  );
};

export default Index;
