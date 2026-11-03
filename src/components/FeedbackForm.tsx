"use client";

import { useRef, useState, type FormEvent } from "react";

type Topic = "Geri bildirim" | "Araç önerisi" | "Hata bildirimi";

export function FeedbackForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", topic: "Geri bildirim" as Topic, message: "" });
  const [status, setStatus] = useState<{ kind: "error" | "success"; message: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const form = formRef.current;
    if (!form) return;

    const emailInput = form.elements.namedItem("email");
    const emailValid = emailInput instanceof HTMLInputElement && emailInput.validity.valid;

    if (!values.name.trim() || !values.email.trim() || !emailValid || values.message.trim().length < 5) {
      setStatus({ kind: "error", message: "Lütfen ad, geçerli bir e-posta adresi ve mesaj alanlarını kontrol edin." });
      form.reportValidity();
      return;
    }

    setStatus({
      kind: "success",
      message: "Form tamamlandı. Bu demo formu mesajınızı bir sunucuya göndermedi veya kaydetmedi.",
    });
  }

  const fieldClass = "w-full min-h-11 rounded-xl bg-surface-elevated border border-border px-3.5 py-2.5 text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="feedback-name" className="block text-sm font-semibold text-main mb-1.5">Ad</label>
          <input id="feedback-name" name="name" type="text" autoComplete="name" required maxLength={80} value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-describedby="feedback-status" aria-invalid={attempted && !values.name.trim()} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="feedback-email" className="block text-sm font-semibold text-main mb-1.5">E-posta</label>
          <input id="feedback-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} aria-describedby="feedback-status" aria-invalid={attempted && (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))} className={fieldClass} />
        </div>
      </div>
      <div>
        <label htmlFor="feedback-topic" className="block text-sm font-semibold text-main mb-1.5">Konu</label>
        <select id="feedback-topic" name="topic" required className={fieldClass} value={values.topic} onChange={(event) => setValues({ ...values, topic: event.target.value as Topic })}>
          {(["Geri bildirim", "Araç önerisi", "Hata bildirimi"] satisfies Topic[]).map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="feedback-message" className="block text-sm font-semibold text-main mb-1.5">Mesaj</label>
        <textarea id="feedback-message" name="message" required minLength={5} maxLength={2000} rows={5} value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} aria-describedby="feedback-status" aria-invalid={attempted && values.message.trim().length < 5} className={`${fieldClass} resize-y`} />
      </div>
      <button type="submit" className="min-h-11 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-semibold text-white transition-colors">Gönder</button>
      <p id="feedback-status" role="status" aria-live="polite" aria-atomic="true" className={`min-h-6 text-sm ${status?.kind === "error" ? "text-rose-600 dark:text-rose-400" : "text-muted"}`}>
        {status?.message ?? "Gönderim öncesi gerekli alanları doldurun."}
      </p>
    </form>
  );
}
