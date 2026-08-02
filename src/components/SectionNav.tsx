import { useEffect, useState } from "react";

export type NavSection = { id: string; label: string };

/**
 * Navegação lateral por pontos: destaca a seção ativa durante o scroll
 * e permite saltar suavemente entre elas.
 */
const SectionNav = ({ sections }: { sections: NavSection[] }) => {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -40% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <nav
      aria-label="Navegação de seções"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            aria-current={isActive}
            className="group flex items-center gap-3"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.25em] transition-all duration-500 ${
                isActive ? "text-white opacity-100" : "text-white/50 opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`h-px transition-all duration-500 ${
                isActive ? "w-10 bg-[#f2540f]" : "w-4 bg-white/30 group-hover:w-7 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default SectionNav;
