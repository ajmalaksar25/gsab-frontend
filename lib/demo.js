// Server-side wiring for the live demo (/demo): a real Google Sheet driven by gsab-js.
// Reads are public and happen in the browser; only writes come through here.
import "server-only";
import { connect } from "gsab";
import { DEMO_SHEET_ID } from "./demo-shared";

export const TEAM_SCHEMA = {
  name: "team",
  fields: {
    id: { type: "integer", primaryKey: true },
    name: { type: "string", required: true, maxLength: 60 },
    email: { type: "string", required: true, maxLength: 80 },
    role: { type: "string", default: "member" },
    status: { type: "string", default: "active" },
  },
};

export const SEED_ROWS = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "admin", status: "active" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com", role: "member", status: "active" },
  { id: 3, name: "Alan Turing", email: "alan@example.com", role: "member", status: "invited" },
  { id: 4, name: "Katherine Johnson", email: "katherine@example.com", role: "viewer", status: "active" },
];

/** Demo guardrails: the sheet is a shared public toy. */
export const MAX_ROWS = 30;

/** Credentials for writes. On Vercel: env vars (client id/secret + refresh token, `drive.file`
 *  scope — it can only touch sheets gsab created). Locally: fall back to the gsab CLI's own
 *  cached login via loopbackAuth(), so `npm run dev` needs no .env at all. */
async function credentials() {
  const { GSAB_DEMO_CLIENT_ID, GSAB_DEMO_CLIENT_SECRET, GSAB_DEMO_REFRESH_TOKEN } = process.env;
  if (GSAB_DEMO_CLIENT_ID && GSAB_DEMO_CLIENT_SECRET && GSAB_DEMO_REFRESH_TOKEN) {
    let cached; // { token, expiresAt }
    return {
      async getToken() {
        if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: GSAB_DEMO_CLIENT_ID,
            client_secret: GSAB_DEMO_CLIENT_SECRET,
            refresh_token: GSAB_DEMO_REFRESH_TOKEN,
            grant_type: "refresh_token",
          }),
        });
        if (!res.ok) throw new Error(`token refresh failed (${res.status}): ${await res.text()}`);
        const { access_token, expires_in } = await res.json();
        cached = { token: access_token, expiresAt: Date.now() + expires_in * 1000 };
        return access_token;
      },
    };
  }
  if (process.env.VERCEL) {
    // Deployed without write credentials: fail with something a visitor can understand.
    throw Object.assign(new Error("Demo writes aren't configured on this deployment yet — reads are still live."), {
      name: "DemoConfigError",
    });
  }
  const { loopbackAuth } = await import("gsab/node");
  return loopbackAuth();
}

let db;
/** The authed SheetManager for the demo sheet (memoized per server instance). */
export async function teamDb() {
  db ??= connect({ spreadsheetId: DEMO_SHEET_ID, auth: await credentials() }).sheet(TEAM_SCHEMA);
  return db;
}

// -- tiny per-IP rate limit (in-memory; per serverless instance, good enough for a demo) --
const hits = new Map();
export function rateLimited(ip, max = 15, windowMs = 60_000) {
  const now = Date.now();
  const h = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  h.push(now);
  hits.set(ip, h);
  return h.length > max;
}
