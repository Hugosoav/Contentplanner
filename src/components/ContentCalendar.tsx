import { type ContentItem, sampleContent } from "@/lib/content-data";
import ContentCard from "./ContentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const contentByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    sampleContent.forEach((item) => {
      const d = item.date;
      if (!map[d]) map[d] = [];
      map[d].push(item);
    });
    return map;
  }, []);

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
    const items = contentByDate[dateStr] || [];

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
          {items.map((item) => (
            <div
              key={item.id}
              className="text-[10px] bg-secondary rounded px-1.5 py-1 truncate font-medium text-secondary-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              title={item.title}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {sampleContent.length} conteúdos planejados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground text-center py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">{cells}</div>
    </div>
  );
};

export default ContentCalendar;
