import { neon } from "@neondatabase/serverless";

let schemaPromise: Promise<void> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export function ensureSchema() {
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = Promise.all([
      sql`CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        timezone TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        purpose TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (date, time)
      )`,
      sql`CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE TABLE IF NOT EXISTS newsletter_signups (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        source TEXT NOT NULL DEFAULT 'evlv-today-instagram',
        status TEXT NOT NULL DEFAULT 'subscribed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    ]).then(() => undefined);
  }
  return schemaPromise;
}
