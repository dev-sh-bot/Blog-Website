"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "duplicate" | "demo">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      setState(data.duplicate ? "duplicate" : response.ok ? data.demo ? "demo" : "success" : "error");
      if (response.ok) setEmail("");
    } catch { setState("error"); }
  }
  return <form className={compact ? "newsletter-form compact" : "newsletter-form"} onSubmit={submit}>
    <label className="sr-only" htmlFor="newsletter-email">Email address</label>
    <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" />
    <button className="button button-dark" disabled={state === "loading"}>{state === "loading" ? "Joining…" : "Subscribe"}</button>
    <p className="form-note" aria-live="polite">{state === "success" && "You’re on the list. Welcome in."}{state === "demo" && "Demo preview — no email was saved. Subscriptions activate after Firebase setup."}{state === "duplicate" && "That email is already subscribed."}{state === "error" && "We couldn’t subscribe you. Try again."}</p>
  </form>;
}
