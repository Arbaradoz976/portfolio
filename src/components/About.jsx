import heroAbout from "../assets/img/hero/PP.jfif";
import undulate from '../assets/img/background/undulate.svg';

export default function About() {
    return (
        <section id="about" className="bg-[#0f0f0f] text-white py-24 px-6 bg-no-repeat bg-[length:100%] bg-left"
                 style={{ backgroundImage: `url(${undulate})` }}>
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Image / Avatar */}
                <div className="w-48 h-48 md:w-60 md:h-60 flex-shrink-0 relative">
                    <div className="absolute inset-0 rounded-full bg-[#8531ff] opacity-40 blur-2xl z-0" />
                    <img
                        src={heroAbout}
                        alt="Julien Mathieu"
                        className="relative z-10 w-full h-full object-cover rounded-full border-4 border-[#00ffd7] shadow-lg"
                    />
                </div>

                {/* Texte de présentation */}
                <div className="text-center md:text-left space-y-6">
                    <h2 className="text-4xl font-bold text-white">À propos de moi</h2>

                    <p>
                        Je suis <strong>Julien Mathieu</strong>, développeur web (BUT MMI – spécialité Dév Web), basé en Nouvelle‑Calédonie. 
                        Mon quotidien : <strong>moderniser des applications</strong> ou des <strong>site</strong> et rendre les interfaces plus simples, rapides et utiles.
                    </p>

                    <p>
                        À la <strong>DSI de la Province Nord</strong> (2024–2025), je participe à la modernisation de <strong>GESBAT</strong> et <strong>ParKoTo</strong> : 
                        refonte mobile‑first, rationalisation CSS et composants <strong>Telerik</strong>, vues SQL pour lister/filtrer, et compatibilité 
                        <strong> ASP.NET WebForms (C#)</strong> avec une base <strong>Oracle</strong> et l’authentification Windows/LDAP. Objectif : faire évoluer un socle existant sans rupture.
                    </p>

                    <p>
                        En parallèle, je mène des projets académiques et personnels : 
                        <strong> Globe Météo</strong> en <strong>React‑Three‑Fiber</strong>/Three.js, prototypes XR (Unity – Meta Quest), 
                        et installations interactives audio‑réactives sous <strong>TouchDesigner</strong>.
                    </p>

                    <p>
                        En 2024, chez <strong>AXIANS NC</strong>, j’ai conduit la migration <strong>Odoo → TeePee</strong> : modèle de données, 
                        formulaires, workflows, intégration Codex, et <strong>formation utilisateurs</strong> pour assurer la passation.
                    </p>

                    <a
                        href="/doc/Resume_Julien_Mathieu.pdf"
                        download
                        className="inline-block px-6 py-2 border border-[#00ffd7] text-[#00ffd7] rounded hover:bg-[#00ffd7] hover:text-black transition"
                    >
                        Télécharger mon CV
                    </a>
                </div>

            </div>
        </section>
    );
}