import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import Card from './Card';

/**
 * StackTabs — catégories sous forme d'onglets (ARIA) + piste horizontale scroll‑snap
 *
 * A11Y & UX clés :
 * - Onglets conformes APG (role=tablist/tabpanel, aria-selected, roving tabindex, flèches ← → Home End)
 * - Pas d'autoplay par défaut (WCAG 2.2.2). Bouton Play/Pause explicite, pause auto au focus/hover.
 * - Respect de prefers‑reduced‑motion : autoplay désactivé si l'utilisateur souhaite moins d'animations.
 * - Scroll horizontal "snap" natif (CSS) + boutons ←/→ pour une navigation au clavier/souris.
 */

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function StackTabs({ data = [] }) {
  // Catégories stables ("subtitle" regroupe la pile/stack)
  const categories = useMemo(() => {
    const set = new Map();
    for (const item of data) if (item?.subtitle) set.set(item.subtitle, true);
    return Array.from(set.keys());
  }, [data]);

  const [activeTab, setActiveTab] = useState(categories[0] || '');
  const visibleCards = useMemo(
    () => data.filter((item) => item.subtitle === activeTab),
    [data, activeTab]
  );

  // Réfs & mesures
  const scrollRef = useRef(null);
  const firstCardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(260); // fallback

  useEffect(() => {
    const el = firstCardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const style = getComputedStyle(el);
      const w = el.offsetWidth;
      const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      setCardWidth(Math.max(1, Math.round(w + marginX)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [visibleCards.length]);

  // Réinitialiser le scroll quand l'onglet change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
  }, [activeTab]);

  // Autoplay contrôlé (off par défaut)
  const [wantsPlay, setWantsPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Démarre/arrête selon wantsPlay et reducedMotion
  useEffect(() => {
    setIsPlaying(wantsPlay && !reducedMotion && visibleCards.length > 4);
  }, [wantsPlay, reducedMotion, visibleCards.length]);

  // Loop doux : avance de 1 carte toutes les ~2s
  useEffect(() => {
    if (!isPlaying) return;
    const wrap = scrollRef.current;
    if (!wrap) return;

    const step = cardWidth; // 1 carte
    const delay = 2000;
    let t = null;

    const tick = () => {
      if (!wrap) return;
      const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - step;
      if (atEnd) {
        wrap.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        wrap.scrollBy({ left: step, behavior: 'smooth' });
      }
      t = window.setTimeout(tick, delay);
    };

    t = window.setTimeout(tick, delay);
    return () => window.clearTimeout(t);
  }, [isPlaying, cardWidth]);

  // Pause automatique au hover/focus, reprise manuelle uniquement
  useEffect(() => {
    const wrap = scrollRef.current;
    if (!wrap) return;
    const onEnter = () => setIsPlaying(false);
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('focusin', onEnter);
    return () => {
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('focusin', onEnter);
    };
  }, []);

  // Navigation boutons
  const scrollByCards = (n) => {
    const wrap = scrollRef.current;
    if (!wrap) return;
    const left = wrap.scrollLeft + n * cardWidth;
    wrap.scrollTo({ left, behavior: 'smooth' });
  };

  // Tabs a11y : roving tabindex + flèches
  const onTabKeyDown = (e, idx) => {
    const count = categories.length;
    if (!count) return;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % count;
    if (e.key === 'ArrowLeft') next = (idx - 1 + count) % count;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = count - 1;
    if (next !== idx) {
      e.preventDefault();
      setActiveTab(categories[next]);
      // focus sera géré par tabIndex (roving) au prochain render
    }
  };

  return (
    <div className="space-y-10">
      {/* Onglets */}
      <div role="tablist" aria-label="Catégories de stack" className="mb-6 flex flex-wrap justify-center gap-3">
        {categories.map((cat, i) => {
          const selected = activeTab === cat;
          const id = `tab-${slugify(cat)}`;
          const panelId = `panel-${slugify(cat)}`;
          return (
            <button
              key={cat}
              id={id}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              onClick={() => setActiveTab(cat)}
              className={[
                'rounded-full border px-4 py-2 transition',
                selected ? 'border-violet-600 bg-violet-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0] focus-visible:ring-offset-2 focus-visible:ring-offset-black',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Barre contrôle carrousel (play/pause + flèches) */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setWantsPlay((v) => !v)}
          aria-pressed={wantsPlay}
          className="inline-flex items-center gap-2 rounded border border-white/20 px-3 py-1 text-sm text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          title={reducedMotion ? 'Préférence système: animations réduites' : undefined}
          disabled={reducedMotion || visibleCards.length <= 4}
        >
          {isPlaying ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
          {isPlaying ? 'Pause' : 'Lire'}
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Défiler vers la gauche"
            onClick={() => scrollByCards(-1)}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Défiler vers la droite"
            onClick={() => scrollByCards(1)}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Panneau actif */}
      <div
        id={`panel-${slugify(activeTab)}`}
        role="tabpanel"
        aria-labelledby={`tab-${slugify(activeTab)}`}
        className="relative mx-auto max-w-screen-xl px-4"
      >
        <div
          ref={scrollRef}
          className="hide-scrollbar mx-auto flex snap-x snap-mandatory gap-6 overflow-x-auto py-2"
        >
          {visibleCards.map((tech, idx) => (
            <div
              key={idx}
              ref={idx === 0 ? firstCardRef : null}
              className="snap-start shrink-0"
              style={{ width: cardWidth }}
            >
              <Card {...tech} />
            </div>
          ))}
        </div>
      </div>

      {/* Motion-reduce: garde un site calme */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #${`panel-${slugify(activeTab)}`} * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
}
