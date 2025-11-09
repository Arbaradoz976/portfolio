import { useEffect, useMemo, useRef, useState } from 'react';
import projects from '../data/projects.json';
import infiniteDestroy from '../assets/img/background/infiniteDestroy.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Palette de dégradés (stable)
const GRADIENTS = [
  'linear-gradient(315deg, hsl(270 73% 53%), hsl(162 100% 58%))',
  'linear-gradient(315deg, hsl(162 100% 58%), #000)',
  'linear-gradient(315deg, hsl(270 73% 53%), #1f1f1f)',
  'linear-gradient(315deg, #1f1f1f, hsl(162 100% 58%))',
  'linear-gradient(315deg, #ffffff10, hsl(270 73% 53%))',
  'linear-gradient(315deg, hsl(270 73% 53%), #4b0082)'
];

function hashStr(str = '') {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h);
}

function gradientFor(title) {
  const idx = hashStr(title) % GRADIENTS.length;
  return GRADIENTS[idx];
}

function ProjectCard({ project, index, total }) {
  const gradient = useMemo(() => gradientFor(project.title || String(index)), [project.title, index]);
  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      className="relative mx-2 w-[280px] shrink-0 overflow-hidden rounded-xl p-6 text-white backdrop-blur-md"
    >
      <div className="absolute inset-0 -z-10" style={{ background: gradient, filter: 'blur(80px)' }} />
      <header>
        <h3 className="text-lg font-bold">{project.title}</h3>
        {project.subtitle && <p className="text-sm text-white/80">{project.subtitle}</p>}
      </header>
      <p className="mt-2 text-sm">{project.description}</p>
      {!!(project.techs && project.techs.length) && (
        <p className="mt-3 text-xs italic text-gray-200">{project.techs.join(' · ')}</p>
      )}
      {project.link && (
        <p className="mt-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-[#00ffd0] px-3 py-1 text-sm text-[#00ffd0] transition-colors hover:bg-[#00ffd0] hover:text-black"
          >
            Voir le projet
          </a>
        </p>
      )}
    </article>
  );
}

export default function Projects() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const cardRef = useRef(null);

  const [index, setIndex] = useState(0); // index du premier slide visible
  const [cardWidth, setCardWidth] = useState(296); // 280 + 2*8 (approx, sera mesuré)
  const [visibleCount, setVisibleCount] = useState(1);
  const total = projects.length;

  // Mesure dynamique: largeur carte + marge
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const style = getComputedStyle(el);
      const w = el.offsetWidth;
      const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      setCardWidth(w + marginX);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Calcule le nombre de cartes visibles selon la largeur du conteneur
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      const count = Math.max(1, Math.floor(w / cardWidth));
      setVisibleCount(count);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [cardWidth]);

  const maxIndex = Math.max(0, total - visibleCount);

  const goto = (i) => {
    const bounded = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1); // loop safe
    setIndex(bounded);
  };
  const next = () => goto(index + 1);
  const prev = () => goto(index - 1);

  // Navigation clavier (← → Home End)
  useEffect(() => {
    const onKey = (e) => {
      if (document.activeElement && wrapRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'Home') { e.preventDefault(); goto(0); }
        if (e.key === 'End') { e.preventDefault(); goto(maxIndex); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, maxIndex]);

  // Annonce SR du changement (sans autoplay => aria-live suffisant)
  const liveRef = useRef(null);
  useEffect(() => {
    const el = liveRef.current;
    if (!el) return;
    const from = index + 1;
    const to = Math.min(index + visibleCount, total);
    el.textContent = `Diapositives ${from} à ${to} sur ${total}`;
  }, [index, visibleCount, total]);

  return (
    <section
      id="projects"
      aria-label="Projets"
      aria-roledescription="carousel"
      className="bg-[#0f0f0f] bg-left bg-no-repeat py-24 px-6 text-white"
      style={{ backgroundImage: `url(${infiniteDestroy})`, backgroundSize: '100%' }}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold md:text-5xl">Projets</h2>

        {/* Live region pour lecteurs d'écran */}
        <p ref={liveRef} className="sr-only" aria-live="polite" />

        <div className="relative flex items-center justify-center" ref={wrapRef}>
          {/* Bouton gauche */}
          <button
            type="button"
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-0 z-20 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Piste */}
          <div className="w-full max-w-6xl overflow-hidden" role="group" aria-roledescription="slides" aria-label="Liste des projets">
            <div
              ref={trackRef}
              id="carousel-track"
              className="flex transition-transform duration-500 ease-in-out motion-reduce:duration-0"
              style={{ transform: `translateX(-${index * cardWidth}px)` }}
            >
              {projects.map((project, i) => (
                <div key={i} ref={i === 0 ? cardRef : undefined}>
                  <ProjectCard project={project} index={i} total={total} />
                </div>
              ))}
            </div>
          </div>

          {/* Bouton droit */}
          <button
            type="button"
            onClick={next}
            aria-label="Suivant"
            className="absolute right-0 z-20 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Respect du prefers-reduced-motion (au cas où d'autres anims existent) */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #projects * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
