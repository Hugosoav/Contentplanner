import { type ContentItem } from "@/lib/content-data";
import { ChevronLeft, ChevronRight, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

interface ContentCalendarProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newDate: string) => void;
}

const ContentCalendar = ({ items, onEdit, onDelete }: ContentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const contentByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    items.forEach((item) => {
      const d = item.date;
      if (!map[d]) map[d] = [];
      map[d].push(item);
    });
    return map;
  }, [items]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-[120px] bg-secondary/30 rounded-lg" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayItems = contentByDate[dateStr] || [];

    cells.push(
      <div
        key={day}
        className={`min-h-[120px] rounded-lg border p-2 transition-colors hover:border-accent/40 ${
          isToday(day) ? "border-accent bg-accent/5" : "border-border bg-card"
        }`}
      >
        <span className={`text-xs font-semibold ${isToday(day) ? "text-accent" : "text-muted-foreground"}`}>
          {day}
        </span>
        <div className="mt-1 space-y-1">
          {dayItems.map((item) => (
            <div
              key={item.id}
              className="group/item text-[10px] bg-secondary rounded px-1.5 py-1 truncate font-medium text-secondary-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between gap-1"
              title={item.title}
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            >
              <span className="truncate">{item.title}</span>
              <span className="hidden group-hover/item:flex items-center gap-0.5 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="hover:text-foreground">
                  <Pencil className="w-2.5 h-2.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="hover:text-destructive">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} conteúdos planejados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground text-center py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{cells}</div>
    </div>
  );
};

export default ContentCalendar;
