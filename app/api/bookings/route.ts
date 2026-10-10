import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getSql, hasDatabase } from "@/db/vercel";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  if (!datePattern.test(date)) return NextResponse.json({ booked: [] });
  if (!hasDatabase()) return NextResponse.json({ booked: [] });
  await ensureSchema();
  const rows = await getSql()`SELECT time FROM bookings WHERE date = ${date} AND status = 'confirmed'` as Array<{ time: string }>;
  return NextResponse.json({ booked: rows.map((row) => row.time) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const required = ["date", "time", "timezone", "name", "email", "purpose"] as const;
  if (!body || required.some((key) => typeof body[key] !== "string" || !(body[key] as string).trim())) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  if (!datePattern.test(body.date as string) || !timePattern.test(body.time as string) || !emailPattern.test(body.email as string)) return NextResponse.json({ error: "Please check the date, time, and email address." }, { status: 400 });
  if (!hasDatabase()) return NextResponse.json({ error: "Scheduling is not configured yet." }, { status: 503 });
  const id = crypto.randomUUID();
  try {
    await ensureSchema();
    const date = (body.date as string).trim();
    const time = (body.time as string).trim();
    const timezone = (body.timezone as string).trim();
    const name = (body.name as string).trim().slice(0, 120);
    const email = (body.email as string).trim().slice(0, 180);
    const company = typeof body.company === "string" ? body.company.trim().slice(0, 160) : null;
    const purpose = (body.purpose as string).trim().slice(0, 120);
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1200) : null;
    const rows = await getSql()`INSERT INTO bookings (id, date, time, timezone, name, email, company, purpose, notes)
      VALUES (${id}, ${date}, ${time}, ${timezone}, ${name}, ${email}, ${company}, ${purpose}, ${notes})
      ON CONFLICT (date, time) DO NOTHING RETURNING id` as Array<{ id: string }>;
    if (!rows.length) return NextResponse.json({ error: "That time was just booked. Please choose another slot." }, { status: 409 });
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Booking could not be saved. Please try again." }, { status: 500 });
  }
}
