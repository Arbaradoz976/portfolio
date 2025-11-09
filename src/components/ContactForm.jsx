import { useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import emailjs from "@emailjs/browser";

/**
 * ContactForm — version sécurisée & accessible
 *
 * - Variables d'env (Vite):
 *   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *   -> Définissez-les dans .env.local (non commité) et/ou dans votre plateforme d'hébergement.
 * - Anti‑spam: champ honeypot caché (bots le remplissent => on ignore l'envoi).
 * - Accessibilité: messages d'erreurs liés par aria-describedby, aria-invalid, live region.
 * - Robustesse: états loading/success/error, bouton désactivé pendant l'envoi (respect rate limit EmailJS 1 req/s).
 */
export default function ContactForm() {
  const [form, setForm] = useState({ user_name: "", user_email: "", message: "", website: "" /* honeypot */ });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, submitted: false, error: "" });
  const formRef = useRef(null);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const validate = () => {
    const next = {};

    if (!form.user_name.trim()) next.user_name = "Le nom est requis.";
    if (!form.user_email.trim()) {
      next.user_email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.user_email)) {
      next.user_email = "Format d'email invalide.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Message trop court (min. 10 caractères).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot: si rempli, on fait comme si tout s'était bien passé, mais on n'envoie rien.
    if (form.website) {
      setStatus({ submitting: false, submitted: true, error: "" });
      if (formRef.current) formRef.current.reset();
      return;
    }

    if (!validate()) return;

    try {
      setStatus({ submitting: true, submitted: false, error: "" });
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus({ submitting: false, submitted: true, error: "" });
      setForm({ user_name: "", user_email: "", message: "", website: "" });
      if (formRef.current) formRef.current.reset();
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      setStatus({ submitting: false, submitted: false, error: "L'envoi a échoué. Réessayez ou écrivez-moi par email." });
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
      <h2 className="mb-6 text-center text-3xl font-bold">Contactez-moi</h2>

      {/* Live region pour statuts globaux */}
      <div aria-live="polite" className="sr-only">
        {status.submitting && "Envoi en cours"}
        {status.submitted && "Merci pour votre message"}
        {status.error && "Erreur d'envoi"}
      </div>

      {status.submitted ? (
        <p className="text-center text-green-400">Merci pour votre message !</p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot (ne pas supprimer) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Votre site web</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" onChange={handleChange} />
          </div>

          <div>
            <input
              type="text"
              name="user_name"
              placeholder="Votre nom"
              defaultValue={form.user_name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.user_name)}
              aria-describedby={errors.user_name ? "err-name" : undefined}
              className="w-full rounded bg-white/20 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ffd0]"
              required
            />
            {errors.user_name && (
              <p id="err-name" className="mt-1 text-sm text-red-300" role="alert">
                {errors.user_name}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="user_email"
              placeholder="Votre email"
              defaultValue={form.user_email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.user_email)}
              aria-describedby={errors.user_email ? "err-email" : undefined}
              className="w-full rounded bg-white/20 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ffd0]"
              required
            />
            {errors.user_email && (
              <p id="err-email" className="mt-1 text-sm text-red-300" role="alert">
                {errors.user_email}
              </p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              rows={4}
              placeholder="Votre message"
              defaultValue={form.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "err-message" : undefined}
              className="w-full rounded bg-white/20 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ffd0]"
              required
            />
            {errors.message && (
              <p id="err-message" className="mt-1 text-sm text-red-300" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            aria-disabled={status.submitting}
            className="w-full rounded bg-gradient-to-r from-[#7f00ff] to-[#00ffd0] px-6 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.submitting ? "Envoi…" : "Envoyer"}
          </button>

          {status.error && (
            <p className="text-sm text-red-300" role="alert">
              {status.error} {" "}
              <a href="mailto:julien.mathieu976@gmail.com" className="underline">Contact direct</a>
            </p>
          )}
        </form>
      )}

      {/* Réseaux sociaux */}
      <div className="mt-8 flex justify-center space-x-6 text-2xl">
        <a
          href="https://github.com/Arbaradoz976"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[#00ffd0]"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/julien-mathieu-157238286/" 
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[#7f00ff]"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}
