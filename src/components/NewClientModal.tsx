import { useState } from "react";
import { type ClientProfile } from "@/lib/client-data";
import { X, Building2, Target, MessageSquare, Users, Globe } from "lucide-react";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientProfile) => void;
}

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "blog", label: "Blog" },
];

const NewClientModal = ({ isOpen, onClose, onSave }: NewClientModalProps) => {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [objectives, setObjectives] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  if (!isOpen) return null;

  const togglePlatform = (p: string) => {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSubmit = () => {
    if (!name.trim() || !area.trim()) return;
    onSave({
      id: `client-${Date.now()}`,
      name: name.trim(),
      area: area.trim(),
      objectives: objectives.trim(),
      tone: tone.trim(),
      audience: audience.trim(),
      platforms,
    });
    setName("");
    setArea("");
    setObjectives("");
    setTone("");
    setAudience("");
    setPlatforms([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-border animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl text-card-foreground">Novo Dashboard</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
              <Building2 className="w-4 h-4 text-accent" /> Nome do Cliente
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Studio Wellness"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>

          {/* Area */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
              <Globe className="w-4 h-4 text-accent" /> Área de Atuação
            </label>
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex: Saúde e Bem-estar"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>

          {/* Objectives */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
              <Target className="w-4 h-4 text-accent" /> Objetivos Estratégicos do Mês
            </label>
            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={2}
              placeholder="Ex: Aumentar agendamentos online em 30%"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
          </div>

          {/* Tone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
              <MessageSquare className="w-4 h-4 text-accent" /> Tom de Voz
            </label>
            <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Ex: Acolhedor, empático e profissional"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>

          {/* Audience */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
              <Users className="w-4 h-4 text-accent" /> Público-alvo
            </label>
            <input value={audience} onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: Mulheres 25-45 anos, interessadas em autocuidado"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>

          {/* Platforms */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => (
                <button key={p.value} onClick={() => togglePlatform(p.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    platforms.includes(p.value)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!name.trim() || !area.trim()}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Criar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewClientModal;
