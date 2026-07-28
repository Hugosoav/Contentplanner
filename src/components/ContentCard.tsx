import { type ContentItem, pillarColors, pillarLabels, platformLabels } from "@/lib/content-data";
import { Calendar, Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ContentCardProps {
  item: ContentItem;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

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
    <div className="group bg-card rounded-md border border-border p-3 hover:border-foreground/20 transition-colors relative">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-card-foreground text-sm leading-snug flex-1">{item.title}</h3>
        <div className="relative -mt-0.5 -mr-0.5" ref={menuRef}>
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

      {item.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
      )}

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5" title={pillarLabels[item.pillar]}>
          <span className={`w-1.5 h-1.5 rounded-full ${pillarColors[item.pillar]}`} />
          {pillarLabels[item.pillar]}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        {item.time && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.time}
          </span>
        )}
        <span className="ml-auto text-[10px] text-muted-foreground/80 uppercase tracking-wide">
          {platformLabels[item.platform]}
        </span>
      </div>
    </div>
  );
};

export default ContentCard;
