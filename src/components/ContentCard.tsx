import { type ContentItem, pillarColors, pillarLabels, statusLabels, platformLabels } from "@/lib/content-data";
import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ContentCardProps {
  item: ContentItem;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-info/10 text-info",
  published: "bg-success/10 text-success",
  idea: "bg-warning/10 text-warning",
};

const ContentCard = ({ item, onEdit, onDelete }: ContentCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="group bg-card rounded-lg border border-border p-4 hover:shadow-md transition-all hover:border-accent/30 animate-fade-in relative">
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusStyles[item.status]}`}>
          {statusLabels[item.status]}
        </span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
              <button
                onClick={() => { onEdit?.(item); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Editar
              </button>
              <button
                onClick={() => { onDelete?.(item.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remover
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-card-foreground text-sm mb-1 leading-snug">{item.title}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${pillarColors[item.pillar]}`} />
          <span className="text-[10px] text-muted-foreground font-medium">{pillarLabels[item.pillar]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {item.time && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {item.time}
            </span>
          )}
          <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-medium">
            {platformLabels[item.platform]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
