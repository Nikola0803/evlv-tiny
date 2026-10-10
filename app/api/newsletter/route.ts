import { NextResponse } from "next/server";
import { ensureSchema, getSql, hasDatabase } from "@/db/vercel";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 180) : "";
  if (!emailPattern.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!hasDatabase()) return NextResponse.json({ error: "Newsletter signup is not configured yet." }, { status: 503 });

  try {
    await ensureSchema();
    await getSql()`INSERT INTO newsletter_signups (id, email, source)
      VALUES (${crypto.randomUUID()}, ${email}, 'evlv-today-instagram')
      ON CONFLICT (email) DO NOTHING`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not add you right now. Please try again." }, { status: 500 });
  }
}
