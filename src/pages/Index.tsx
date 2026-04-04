import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import ContentCalendar from "@/components/ContentCalendar";
import MetricsBar from "@/components/MetricsBar";
import ContentBoard from "@/components/ContentBoard";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import NewClientModal from "@/components/NewClientModal";
import NewContentModal from "@/components/NewContentModal";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { type ClientProfile } from "@/lib/client-data";
import { type ContentItem } from "@/lib/content-data";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Plus, Search, Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [showNewClient, setShowNewClient] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem("contentplan_tutorial_done");
  });
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  // AI suggestions kept in memory (not persisted)
  const [suggestionsByClient, setSuggestionsByClient] = useState<Record<string, Suggestion[]>>({});

  const {
    loading,
    clients,
    selectedClient,
    setSelectedClient,
    contentByClient,
    ideasByClient,
    addClient,
    deleteClient,
    saveContent,
    deleteContent,
    moveContent,
    addIdea,
  } = useSupabaseData();

  const clientId = selectedClient?.id || "";
  const currentItems = contentByClient[clientId] || [];
  const currentSuggestions = suggestionsByClient[clientId] || [];
  const currentIdeas = ideasByClient[clientId] || [];

  const handleNewClient = async (client: ClientProfile) => {
    try {
      await addClient(client);
      toast.success("Dashboard criado!");
    } catch {
      toast.error("Erro ao criar dashboard.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
    const remaining = clients.filter((c) => c.id !== id);
    setSelectedClient(remaining.length > 0 ? remaining[0] : null);
    toast.success("Dashboard removido.");
  };

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("contentplan_tutorial_done", "true");
  };

  const handleSaveContent = async (item: ContentItem) => {
    try {
      await saveContent(clientId, item, !!editingContent);
      setEditingContent(null);
      toast.success(editingContent ? "Conteúdo atualizado!" : "Conteúdo criado!");
    } catch {
      toast.error("Erro ao salvar conteúdo.");
    }
  };

  const handleDeleteContent = async (id: string) => {
    await deleteContent(clientId, id);
    toast.success("Conteúdo removido.");
  };

  const handleMoveContent = async (id: string, newDate: string) => {
    await moveContent(clientId, id, newDate);
    toast.success("Conteúdo movido!");
  };

  const handleMoveToIdeas = async (suggestion: Suggestion) => {
    await addIdea(clientId, suggestion);
    toast.success("Sugestão movida para Ideias!");
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setShowContentModal(true);
  };

  const handleAddFromAI = async (item: ContentItem) => {
    try {
      await saveContent(clientId, item, false);
      toast.success("Conteúdo adicionado ao calendário!");
    } catch {
      toast.error("Erro ao adicionar conteúdo.");
    }
  };

  const handleSuggestionsChange = (newSuggestions: Suggestion[]) => {
    setSuggestionsByClient((prev) => ({ ...prev, [clientId]: newSuggestions }));
  };

  const noClients = clients.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {showTutorial && (
        <OnboardingTutorial
          onComplete={handleCompleteTutorial}
          onCreateClient={() => setShowNewClient(true)}
        />
      )}

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTutorial(true)}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <Rocket className="w-4 h-4" />
                Tutorial
              </button>
              <button
                onClick={() => { setEditingContent(null); setShowContentModal(true); }}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm"
                disabled={noClients}
              >
                <Plus className="w-4 h-4" />
                Novo Conteúdo
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {noClients ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Rocket className="w-10 h-10 text-accent" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Comece criando seu primeiro Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  Crie um dashboard para seu cliente ou projeto. Defina a área de atuação, objetivos, tom de voz e público-alvo para receber sugestões estratégicas da IA.
                </p>
              </div>
              <button
                onClick={() => setShowNewClient(true)}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Criar Dashboard
              </button>
            </div>
          ) : (
            <>
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
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl text-foreground">Banco de Ideias</h2>
                    <p className="text-sm text-muted-foreground mt-1">{currentIdeas.length} ideias salvas</p>
                  </div>
                  {currentIdeas.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-xl">
                      <p className="text-muted-foreground text-sm">Mova sugestões da IA para cá usando o botão de lâmpada.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {currentIdeas.map((s, i) => (
                        <div key={i} className="bg-card rounded-xl border border-border p-5">
                          <div className="flex items-start justify-between mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-accent/10 text-accent">{s.pillar}</span>
                            <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">{s.format}</span>
                          </div>
                          <h3 className="font-semibold text-card-foreground text-sm mb-1.5">{s.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{s.description}</p>
                          <p className="text-xs text-muted-foreground italic">"{s.hook}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeView === "analytics" && (
                <div className="text-center py-20">
                  <h2 className="font-heading text-2xl text-foreground mb-2">Métricas e Relatórios</h2>
                  <p className="text-muted-foreground text-sm">Acompanhe o desempenho do seu conteúdo.</p>
                </div>
              )}
            </>
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
