import { statusLabels, type ContentStatus, type ContentItem } from "@/lib/content-data";
import ContentCard from "./ContentCard";

const columns: ContentStatus[] = ["idea", "draft", "scheduled", "published"];

const columnStyles: Record<ContentStatus, string> = {
  idea: "border-t-warning",
  draft: "border-t-muted-foreground",
  scheduled: "border-t-info",
  published: "border-t-success",
};

interface ContentBoardProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

const ContentBoard = ({ items, onEdit, onDelete }: ContentBoardProps) => {
  return (
    <div>
      <h2 className="font-heading text-2xl text-foreground mb-6">Quadro de Conteúdos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {columns.map((status) => {
          const colItems = items.filter((c) => c.status === status);
          return (
            <div key={status} className={`border-t-2 ${columnStyles[status]} pt-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">{statusLabels[status]}</h3>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                  {colItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {colItems.map((item) => (
                  <ContentCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentBoard;
