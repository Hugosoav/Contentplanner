import { useState } from "react";
import { type ClientProfile } from "@/lib/client-data";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, Calendar, Tag, Monitor, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface AISuggestionsProps {
  client: ClientProfile;
}

interface Suggestion {
  title: string;
  description: string;
  pillar: string;
  platform: string;
  suggestedDate: string;
  format: string;
  hook: string;
}

const pillarColorMap: Record<string, string> = {
  educativo: "bg-info/10 text-info",
  autoridade: "bg-accent/10 text-accent",
  engajamento: "bg-success/10 text-success",
  vendas: "bg-warning/10 text-warning",
  bastidores: "bg-muted text-muted-foreground",
};

const AISuggestions = ({ client }: AISuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const { data, error } = await supabase.functions.invoke("suggest-content", {
        body: { clientProfile: client, month, existingContent: [] },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuggestions(data.suggestions || []);
      toast.success(`${data.suggestions?.length || 0} sugestões geradas!`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Erro ao gerar sugestões");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-foreground">Sugestões de IA</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conteúdos estratégicos personalizados para <span className="font-semibold text-foreground">{client.name}</span>
          </p>
        </div>
        <button onClick={generateSuggestions} disabled={loading}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Gerando..." : "Gerar Sugestões"}
        </button>
      </div>

      {/* Client profile summary */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Área</p>
          <p className="text-sm font-medium text-foreground">{client.area}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Tom de Voz</p>
          <p className="text-sm font-medium text-foreground">{client.tone || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Público-alvo</p>
          <p className="text-sm font-medium text-foreground">{client.audience || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Objetivos</p>
          <p className="text-sm font-medium text-foreground">{client.objectives || "—"}</p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length === 0 && !loading && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Clique em "Gerar Sugestões" para receber ideias de conteúdo personalizadas com IA.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-accent mx-auto mb-3 animate-spin" />
          <p className="text-muted-foreground text-sm">Analisando perfil e gerando sugestões estratégicas...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-accent/30 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${pillarColorMap[s.pillar] || "bg-muted text-muted-foreground"}`}>
                  {s.pillar}
                </span>
                <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">{s.format}</span>
              </div>

              <h3 className="font-semibold text-card-foreground text-sm mb-1.5 leading-snug">{s.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{s.description}</p>

              <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Gancho
                </p>
                <p className="text-xs text-foreground font-medium italic">"{s.hook}"</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {s.suggestedDate}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Monitor className="w-3 h-3" /> {s.platform}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
