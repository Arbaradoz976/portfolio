import heroImg from "../assets/img/hero/PP.jfif"; // Remplace par ton portrait
import { FaLinkedin, FaGithub, FaEnvelope, FaYoutube } from "react-icons/fa";
import bgChaos from "../assets/img/background/chaos.svg";

export default function HeroDark() {
  return (
    <section
      id="home"
      aria-label="Section d’accueil"
      className="flex min-h-screen w-full items-center justify-center bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${bgChaos})`, backgroundSize: "1000px" }}
    >
      {/* Carte héro avec overlay pour le contraste */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 rounded-xl bg-black/50 px-8 py-12 text-white shadow-2xl backdrop-blur md:flex-row md:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.6)_100%)]" />

        {/* Avatar avec halo */}
        <div className="relative h-56 w-56 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full bg-[#8531ff] opacity-70 blur-[60px] md:opacity-60 motion-safe:animate-pulse"
            aria-hidden="true"
          />
          <img
            src={heroImg}
            alt="Julien Mathieu"
            className="relative z-10 h-full w-full rounded-full object-cover shadow-lg ring-2 ring-white/10"
            decoding="async"
            loading="eager"
          />
        </div>

        {/* Contenu */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight">
            Salut, je suis <span className="text-[#8531ff]">Julien</span>
          </h1>
          <h2 className="text-2xl font-semibold text-[#00ffd0]">
            Développeur full-stack
          </h2>
          <p className="mx-auto max-w-md text-white/80 md:mx-0">
            <p>
              Je conçois et fais évoluer des applications et des sites pour en
              faire des expériences fiables, rapides et pensées{" "}
              <em>mobile-first</em>.
            </p>
          </p>

          {/* Réseaux sociaux */}
          <div className="flex justify-center gap-4 text-xl md:justify-start">
            <a
              href="https://github.com/Arbaradoz976"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub — ouvre un nouvel onglet"
              className="transition-colors hover:text-[#00ffd0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/julien-mathieu-157238286/" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn — ouvre un nouvel onglet"
              className="transition-colors hover:text-[#8531ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8531ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:julien.mathieu976@gmail.com"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Envoyer un email"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href="#contact"
              className="inline-block rounded border border-[#8531ff] px-6 py-2 font-semibold text-[#8531ff] transition-colors hover:bg-[#8531ff] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8531ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Me contacter
            </a>
            <a
              href="/doc/cv.pdf"
              download
              className="inline-block rounded border border-[#00ffd0] px-6 py-2 font-semibold text-[#00ffd0] transition-colors hover:bg-[#00ffd0] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Télécharger mon CV
            </a>
          </div>
        </div>
      </div>

      {/* Respect de prefers-reduced-motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-pulse { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
