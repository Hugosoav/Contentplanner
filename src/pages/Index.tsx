import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import ContentCalendar from "@/components/ContentCalendar";
import MetricsBar from "@/components/MetricsBar";
import ContentBoard from "@/components/ContentBoard";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import NewClientModal from "@/components/NewClientModal";
import NewContentModal from "@/components/NewContentModal";
import { sampleClients, type ClientProfile } from "@/lib/client-data";
import { type ContentItem } from "@/lib/content-data";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [clients, setClients] = useState<ClientProfile[]>(sampleClients);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(sampleClients[0]);
  const [showNewClient, setShowNewClient] = useState(false);

  // Content state per client
  const [contentByClient, setContentByClient] = useState<Record<string, ContentItem[]>>({});
  const [suggestionsByClient, setSuggestionsByClient] = useState<Record<string, Suggestion[]>>({});
  const [ideasByClient, setIdeasByClient] = useState<Record<string, Suggestion[]>>({});

  // Content modal
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  const clientId = selectedClient?.id || "";
  const currentItems = contentByClient[clientId] || [];
  const currentSuggestions = suggestionsByClient[clientId] || [];
  const currentIdeas = ideasByClient[clientId] || [];

  const handleNewClient = (client: ClientProfile) => {
    setClients((prev) => [...prev, client]);
    setSelectedClient(client);
  };

  const handleDeleteClient = (id: string) => {
    if (clients.length <= 1) {
      toast.error("Você precisa ter pelo menos um dashboard.");
      return;
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    setContentByClient((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setSuggestionsByClient((prev) => { const n = { ...prev }; delete n[id]; return n; });
    if (selectedClient?.id === id) {
      const remaining = clients.filter((c) => c.id !== id);
      setSelectedClient(remaining[0]);
    }
    toast.success("Dashboard removido.");
  };

  const handleSaveContent = (item: ContentItem) => {
    setContentByClient((prev) => {
      const items = prev[clientId] || [];
      const exists = items.find((i) => i.id === item.id);
      if (exists) {
        return { ...prev, [clientId]: items.map((i) => (i.id === item.id ? item : i)) };
      }
      return { ...prev, [clientId]: [...items, item] };
    });
    setEditingContent(null);
    toast.success(editingContent ? "Conteúdo atualizado!" : "Conteúdo criado!");
  };

  const handleDeleteContent = (id: string) => {
    setContentByClient((prev) => ({
      ...prev,
      [clientId]: (prev[clientId] || []).filter((i) => i.id !== id),
    }));
    toast.success("Conteúdo removido.");
  };

  const handleMoveContent = (id: string, newDate: string) => {
    setContentByClient((prev) => ({
      ...prev,
      [clientId]: (prev[clientId] || []).map((i) => i.id === id ? { ...i, date: newDate } : i),
    }));
    toast.success("Conteúdo movido!");
  };

  const handleMoveToIdeas = (suggestion: Suggestion) => {
    setIdeasByClient((prev) => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), suggestion],
    }));
    toast.success("Sugestão movida para Ideias!");
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setShowContentModal(true);
  };

  const handleAddFromAI = (item: ContentItem) => {
    setContentByClient((prev) => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), item],
    }));
  };

  const handleSuggestionsChange = (newSuggestions: Suggestion[]) => {
    setSuggestionsByClient((prev) => ({ ...prev, [clientId]: newSuggestions }));
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
        onDeleteClient={handleDeleteClient}
      />

      <main className="flex-1 overflow-auto">
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
            <button
              onClick={() => { setEditingContent(null); setShowContentModal(true); }}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Conteúdo
            </button>
          </div>
        </header>

        <div className="p-8">
          <MetricsBar items={currentItems} />

          {activeView === "calendar" && (
            <ContentCalendar items={currentItems} onEdit={handleEditContent} onDelete={handleDeleteContent} onMove={handleMoveContent} />
          )}
          {activeView === "board" && (
            <ContentBoard items={currentItems} onEdit={handleEditContent} onDelete={handleDeleteContent} />
          )}
          {activeView === "ai" && selectedClient && (
            <AISuggestions
              client={selectedClient}
              suggestions={currentSuggestions}
              onSuggestionsChange={handleSuggestionsChange}
              existingContent={currentItems}
              onAddToCalendar={handleAddFromAI}
              onMoveToIdeas={handleMoveToIdeas}
            />
          )}
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
      <NewContentModal
        isOpen={showContentModal}
        onClose={() => { setShowContentModal(false); setEditingContent(null); }}
        onSave={handleSaveContent}
        editItem={editingContent}
      />
    </div>
  );
};

export default Index;
