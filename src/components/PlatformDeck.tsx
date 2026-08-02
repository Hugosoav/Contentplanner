import { useState } from "react";

export interface DeckFeature {
  tag: string;
  title: string;
  desc: string;
  img: string;
}

interface Props {
  features: DeckFeature[];
}

/**
 * Pilha de imagens sobrepostas em camadas. Ao clicar em uma delas,
 * ela vem para a frente e o texto correspondente é exibido.
 */
const PlatformDeck = ({ features }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const n = features.length;
  const active = features[activeIndex];

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Camadas de imagens */}
      <div className="relative h-[280px] sm:h-[380px] lg:h-[440px] [perspective:1400px]">
        {features.map((f, i) => {
          // posição relativa na pilha (0 = frente)
          const order = (i - activeIndex + n) % n;
          const isFront = order === 0;

          return (
            <button
              key={f.tag}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver ${f.tag}`}
              aria-pressed={isFront}
              className="absolute left-0 top-1/2 w-[86%] origin-center cursor-pointer rounded-2xl outline-none transition-all duration-500 ease-out will-change-transform focus-visible:ring-2 focus-visible:ring-[#f2540f]"
              style={{
                zIndex: n - order,
                transform: `translate3d(${order * 9}%, calc(-50% + ${order * 14}px), 0) scale(${1 - order * 0.06}) rotate(${order * 1.5}deg)`,
                opacity: 1 - order * 0.18,
                filter: isFront ? "none" : "saturate(0.7) brightness(0.75)",
              }}
            >
              <div
                className={`overflow-hidden rounded-2xl border bg-[#0f0f0f] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] transition-all duration-500 ${
                  isFront ? "border-[#f2540f]/40" : "border-white/10"
                }`}
              >
                {/* Barra no estilo do dashboard do projeto */}
                <div className="flex items-center gap-2 border-b border-white/10 bg-[#141414] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f2540f]/70" />
                  <span className="ml-3 truncate text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Sincro · {f.tag}
                  </span>
                </div>
                <img src={f.img} alt={f.title} loading="lazy" className="w-full" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Texto do card ativo */}
      <div key={active.tag} className="animate-fade-in">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#f2540f]">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-[#f2540f]/60" />
          <span>{active.tag}</span>
        </div>
        <h4 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{active.title}</h4>
        <p className="mt-4 text-base leading-relaxed text-white/60">{active.desc}</p>

        <div className="mt-8 flex items-center gap-2">
          {features.map((f, i) => (
            <button
              key={f.tag}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={f.tag}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-10 bg-[#f2540f]" : "w-4 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformDeck;
