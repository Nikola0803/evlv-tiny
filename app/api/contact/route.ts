import { NextResponse } from "next/server";
import { ensureSchema, getSql, hasDatabase } from "@/db/vercel";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const required = ["name", "email", "subject", "message"] as const;
  if (!body || required.some((key) => typeof body[key] !== "string" || !(body[key] as string).trim())) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  if (!emailPattern.test(body.email as string)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  const hasEmailDelivery = Boolean(process.env.RESEND_API_KEY);
  if (!hasDatabase() && !hasEmailDelivery) return NextResponse.json({ error: "The contact form is not configured yet. Please email or call us directly." }, { status: 503 });
  try {
    const id = crypto.randomUUID();
    const name = (body.name as string).trim().slice(0, 120);
    const email = (body.email as string).trim().slice(0, 180);
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 60) : null;
    const subject = (body.subject as string).trim().slice(0, 160);
    const message = (body.message as string).trim().slice(0, 3000);
    if (hasDatabase()) {
      await ensureSchema();
      await getSql()`INSERT INTO contact_messages (id, name, email, phone, subject, message)
        VALUES (${id}, ${name}, ${email}, ${phone}, ${subject}, ${message})`;
    }
    if (hasEmailDelivery) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "EVLV Hub <contact@evlv.bio>",
          to: ["office@evlvpeptides.com"],
          reply_to: email,
          subject: `EVLV Hub: ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\n${message}`,
        }),
      });
      if (!response.ok) throw new Error("Email delivery failed");
    }
    return NextResponse.json({ ok: true, id });
  } catch { return NextResponse.json({ error: "Your message could not be saved. Please email or call us directly." }, { status: 500 }); }
}
