"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("sending");
    const email = String(new FormData(event.currentTarget).get("email") || "");
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Something went wrong.");
      setStatus("idle");
      return;
    }
    setStatus("success");
  }

  return <section className="newsletter" aria-labelledby="newsletter-title">
    <span className="newsletter-icon"><Mail size={20}/></span>
    <div className="newsletter-copy"><p className="eyebrow">EVLV Weekly</p><h2 id="newsletter-title">One useful wellness idea every week.</h2><p>Peptides, sleep, recovery, protocols, and the questions people struggle to get answered.</p></div>
    {status === "success" ? <div className="newsletter-success"><Check size={18}/><span><strong>You&apos;re on the list.</strong><small>Watch your inbox for EVLV Weekly.</small></span></div> : <form className="newsletter-form" onSubmit={submit}><div><input name="email" type="email" required autoComplete="email" placeholder="Email address" aria-label="Email address"/><button disabled={status === "sending"}>{status === "sending" ? "Joining..." : "Join free"}<ArrowRight size={15}/></button></div>{error && <p className="newsletter-error" role="alert">{error}</p>}<small>Clear education. No spam. Unsubscribe anytime.</small></form>}
  </section>;
}
