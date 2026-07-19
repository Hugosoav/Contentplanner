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
 * Seção pinada com efeito de "stacked cards": cada painel (imagem + texto)
 * sobe de baixo empilhando-se sobre o anterior conforme o usuário rola.
 */
const HorizontalFeatures = ({ features }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
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

  const n = features.length;

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${n * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {features.map((f, i) => {
          // Progresso local por painel: 0 = ainda embaixo, 1 = totalmente no lugar
          const raw = progress * n - i;
          const local = Math.max(0, Math.min(1, raw));
          const eased = 1 - Math.pow(1 - local, 3); // easeOutCubic

          // Card sobe de baixo (110% → 0%)
          const translateY = (1 - eased) * 110;
          // Painéis anteriores recuam levemente para trás (escala + opacidade)
          const behind = Math.max(0, raw - 1);
          const behindClamped = Math.min(1, behind);
          const scale = 1 - behindClamped * 0.06;
          const opacity = 1 - behindClamped * 0.35;
          const flip = i % 2 === 1;

          return (
            <div
              key={f.tag}
              className="absolute inset-0 flex items-center justify-center px-5 lg:px-16"
              style={{
                zIndex: i + 1,
                transform: `translate3d(0, ${translateY}%, 0) scale(${scale})`,
                opacity,
                transition: "transform 0.15s linear, opacity 0.2s linear",
                willChange: "transform, opacity",
              }}
            >
              <div className="relative w-full max-w-6xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:p-12">
                <div
                  className={`relative grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14 ${
                    flip ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#ff8a1f]">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-[#ff8a1f]/60" />
                      <span>{f.tag}</span>
                    </div>
                    <h4 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
                      {f.title}
                    </h4>
                    <p className="mt-5 text-base leading-relaxed text-white/60">
                      {f.desc}
                    </p>
                  </div>
                  <div className="group relative [perspective:1200px]">
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-brand opacity-30 transition-all duration-500 group-hover:opacity-50" />
                    <img
                      src={f.img}
                      alt={f.title}
                      loading="lazy"
                      className="relative w-full rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-2 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de progresso */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[999] flex -translate-x-1/2 items-center gap-2">
          {features.map((_, i) => {
            const active = Math.min(n - 1, Math.floor(progress * n)) === i;
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