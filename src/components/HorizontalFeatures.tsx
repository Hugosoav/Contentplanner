import { useEffect, useRef, useState } from "react";

export interface HFeature {
  tag: string;
  title: string;
  desc: string;
  img: string;
}

interface Props {
  features: HFeature[];
}

/**
 * Sessão pinada verticalmente que converte scroll vertical em movimento
 * horizontal do trilho de features. Cada card ocupa a viewport inteira.
 */
const HorizontalFeatures = ({ features }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      // 0 quando o topo do wrapper toca o topo da viewport
      // 1 quando o wrapper terminou de rolar por dentro
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [features.length]);

  // Total horizontal travel: (n - 1) painéis
  const n = features.length;
  const translate = -progress * ((n - 1) / n) * 100;

  return (
    <div
      ref={wrapperRef}
      // Altura = 1 tela por painel para dar espaço de scroll
      style={{ height: `${n * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{
            width: `${n * 100}%`,
            transform: `translate3d(${translate}%, 0, 0)`,
            transition: "transform 0.1s linear",
          }}
        >
          {features.map((f, i) => {
            // Painel local: 0 = fora à direita, 1 = centro, 2 = saiu à esquerda
            const panelProgress = progress * (n - 1) - i;
            const local = Math.max(-1, Math.min(1, panelProgress));
            const opacity = 1 - Math.min(1, Math.abs(local));
            const parallax = local * 40; // px

            return (
              <section
                key={f.tag}
                className="flex h-full shrink-0 items-center justify-center px-6 lg:px-16"
                style={{ width: `${100 / n}%` }}
              >
                <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
                  <div
                    style={{
                      opacity: 0.15 + opacity * 0.85,
                      transform: `translateX(${-parallax}px)`,
                    }}
                    className="transition-opacity"
                  >
                    <span className="text-[11px] uppercase tracking-[0.3em] text-[#ff8a1f]">
                      {f.tag}
                    </span>
                    <h4 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                      {f.title}
                    </h4>
                    <p className="mt-4 text-base leading-relaxed text-white/60">
                      {f.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/30" />
                      <span>{String(n).padStart(2, "0")}</span>
                    </div>
                  </div>
                  <div
                    className="group relative [perspective:1200px]"
                    style={{ transform: `translateX(${parallax}px)` }}
                  >
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-70 group-hover:blur-3xl" />
                    <img
                      src={f.img}
                      alt={f.title}
                      loading="lazy"
                      className="relative w-full rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-2 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Indicador de progresso */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {features.map((_, i) => {
            const active = Math.round(progress * (n - 1)) === i;
            return (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  active ? "w-10 bg-[#ff8a1f]" : "w-4 bg-white/25"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HorizontalFeatures;