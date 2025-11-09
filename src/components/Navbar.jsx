import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const disclosureBtnRef = useRef(null);
  const menuRef = useRef(null);

  // Définis ici l'ordre des sections présentes sur la page
  const items = useMemo(
    () => [
      { id: "home", label: "Accueil", href: "#home" },
      { id: "about", label: "À propos", href: "#about" },
      { id: "stack", label: "Stack", href: "#stack" },
      { id: "projects", label: "Projets", href: "#projects" },
      { id: "contact", label: "Contact", href: "#contact" },
    ],
    []
  );

  // Verrouille le scroll quand le menu mobile est ouvert
  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      root.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  // Ferme le menu quand on navigue via ancre ou quand on appuie sur Échap
  useEffect(() => {
    const onHashChange = () => setIsOpen(false);
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        disclosureBtnRef.current?.focus();
      }
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Met à jour le lien actif avec IntersectionObserver
  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Choisit la section la plus visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 text-white backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-2 top-2 z-[60] rounded bg-black px-3 py-2 text-white shadow focus:outline-none focus:ring-2 focus:ring-[#00ffd0]"
      >
        Aller au contenu principal
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo + Nav desktop */}
        <div className="flex items-center gap-8">
          <a href="#home" className="shrink-0" aria-label="Aller à l’accueil">
            <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
          </a>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={activeId === item.id ? "page" : undefined}
                    className={[
                      "rounded px-1.5 py-1 transition-colors",
                      activeId === item.id
                        ? "text-[#00ffd0]"
                        : "text-white/85 hover:text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bouton menu mobile (disclosure) */}
        <button
          ref={disclosureBtnRef}
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0]"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={toggle}
        >
          {isOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!isOpen}
        className="md:hidden overflow-hidden border-t border-white/10"
      >
        <nav aria-label="Navigation principale mobile" className="px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={close}
                  aria-current={activeId === item.id ? "page" : undefined}
                  className={[
                    "block rounded px-2 py-2",
                    activeId === item.id
                      ? "bg-white/10 text-[#00ffd0]"
                      : "text-white/90 hover:bg-white/5 hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffd0] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
