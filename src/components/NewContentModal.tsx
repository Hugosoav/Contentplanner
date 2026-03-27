import { useState } from "react";
import { X } from "lucide-react";
import {
  type ContentItem,
  type ContentStatus,
  type ContentPillar,
  type ContentPlatform,
  pillarLabels,
  statusLabels,
  platformLabels,
} from "@/lib/content-data";

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
  editItem?: ContentItem | null;
}

const NewContentModal = ({ isOpen, onClose, onSave, editItem }: NewContentModalProps) => {
  const [title, setTitle] = useState(editItem?.title || "");
  const [description, setDescription] = useState(editItem?.description || "");
  const [status, setStatus] = useState<ContentStatus>(editItem?.status || "draft");
  const [pillar, setPillar] = useState<ContentPillar>(editItem?.pillar || "educativo");
  const [platform, setPlatform] = useState<ContentPlatform>(editItem?.platform || "instagram");
  const [date, setDate] = useState(editItem?.date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(editItem?.time || "");

  // Reset form when editItem changes
  useState(() => {
    if (editItem) {
      setTitle(editItem.title);
      setDescription(editItem.description);
      setStatus(editItem.status);
      setPillar(editItem.pillar);
      setPlatform(editItem.platform);
      setDate(editItem.date);
      setTime(editItem.time || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("draft");
      setPillar("educativo");
      setPlatform("instagram");
      setDate(new Date().toISOString().split("T")[0]);
      setTime("");
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: editItem?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status,
      pillar,
      platform,
      date,
      time: time || undefined,
    });
    onClose();
  };

  const pillars: ContentPillar[] = ["educativo", "autoridade", "engajamento", "vendas", "bastidores"];
  const statuses: ContentStatus[] = ["idea", "draft", "scheduled", "published"];
  const platforms: ContentPlatform[] = ["instagram", "linkedin", "tiktok", "youtube", "blog"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-foreground">
            {editItem ? "Editar Conteúdo" : "Novo Conteúdo"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Título do conteúdo"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none h-20"
              placeholder="Breve descrição do conteúdo"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pilar</label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as ContentPillar)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {pillars.map((p) => (
                  <option key={p} value={p}>{pillarLabels[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plataforma</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{platformLabels[p]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Horário</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              {editItem ? "Salvar" : "Criar Conteúdo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContentModal;
