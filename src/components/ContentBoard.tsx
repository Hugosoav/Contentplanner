import { statusLabels, type ContentStatus, type ContentItem } from "@/lib/content-data";
import ContentCard from "./ContentCard";

const columns: ContentStatus[] = ["idea", "draft", "scheduled", "published"];

const columnBadge: Record<ContentStatus, string> = {
  idea: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  draft: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

interface ContentBoardProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

const ContentBoard = ({ items, onEdit, onDelete }: ContentBoardProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((status) => {
          const colItems = items.filter((c) => c.status === status);
          return (
            <div key={status} className="min-w-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${columnBadge[status]}`}>
                  {statusLabels[status]}
                </span>
                <span className="text-xs text-muted-foreground font-medium tabular-nums">{colItems.length}</span>
              </div>
              <div className="space-y-2">
                {colItems.map((item) => (
                  <ContentCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
                ))}
                {colItems.length === 0 && (
                  <div className="text-xs text-muted-foreground/60 px-3 py-6 text-center border border-dashed border-border rounded-lg">
                    Vazio
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentBoard;
