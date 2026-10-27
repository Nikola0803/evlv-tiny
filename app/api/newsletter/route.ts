import { NextResponse } from "next/server";
import { ensureSchema, getSql, hasDatabase } from "@/db/vercel";
import { crmConfigured, crmFetch } from "@/app/lib/crm-proxy";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter { email } -- primary path is the CRM's own
// /api/store/newsletter (same CRM_API_URL/CRM_ORG_API_KEY/CRM_STORE_DOMAIN
// pattern as evlv-site): it upserts a real Contact row, issues a genuine
// single-use welcome coupon, pushes to Omnisend, and sends the confirmation
// email. Without that, a signup here used to land only in this app's own
// throwaway newsletter_signups table -- never reaching the CRM, never
// getting a working coupon, never entering any automation.
//
// The local Postgres insert below is now a best-effort secondary log only
// (kept for evlv.bio's own records / in case the CRM is briefly down) --
// it never blocks or overrides the CRM result.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 180) : "";
  if (!emailPattern.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  if (hasDatabase()) {
    ensureSchema()
      .then(() =>
        getSql()`INSERT INTO newsletter_signups (id, email, source)
          VALUES (${crypto.randomUUID()}, ${email}, 'evlv-bio')
          ON CONFLICT (email) DO NOTHING`
      )
      .catch((err) => console.error("[newsletter] local log insert failed", err));
  }

  if (!crmConfigured()) {
    return NextResponse.json({ error: "Newsletter signup isn't connected to the CRM yet." }, { status: 503 });
  }

  const { ok, status, data } = await crmFetch("/api/store/newsletter", { email });
  return NextResponse.json(data, { status: ok ? 200 : status });
}
