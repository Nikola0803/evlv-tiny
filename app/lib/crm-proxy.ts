import "server-only";

/**
 * Shared config/helper for proxying to the custom CRM (peptides-crm-app).
 * Mirrors evlv-site/src/lib/crm-proxy.ts exactly -- same env var names, same
 * header pair -- so evlv.bio writes into the same CRM Contact table instead
 * of only its own standalone Postgres. CRM_API_URL / CRM_ORG_API_KEY /
 * CRM_STORE_DOMAIN are server-only env vars (no NEXT_PUBLIC_ prefix) so the
 * API key never reaches the browser. The CRM's getStoreContext() resolves
 * the brand via the x-store-domain + x-store-api-key header pair (see
 * peptides-crm-app/src/lib/store-context.ts).
 */
export function crmConfigured() {
  return Boolean(process.env.CRM_API_URL && process.env.CRM_ORG_API_KEY && process.env.CRM_STORE_DOMAIN);
}

export async function crmFetch(path: string, body: unknown) {
  try {
    const res = await fetch(`${process.env.CRM_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-store-domain": process.env.CRM_STORE_DOMAIN!,
        "x-store-api-key": process.env.CRM_ORG_API_KEY!,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: { error: "CRM service temporarily unavailable" } };
  }
}
