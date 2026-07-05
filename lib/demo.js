// Server-side wiring for the live demo (/demo): a real Google Sheet driven by gsab-js.
// Reads are public and happen in the browser; only writes come through here.
import "server-only";
import { connect } from "gsab-js";
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

/** Credentials for writes — the recipe from the gsab-js README, verbatim. Deployed: the
 *  GSAB_CLIENT_ID / GSAB_CLIENT_SECRET / GSAB_REFRESH_TOKEN env vars (drive.file scope — it
 *  can only touch sheets gsab created; print them once with deployEnv()). Locally: fall back
 *  to the gsab CLI's cached login via loopbackAuth(), so `npm run dev` needs no .env at all. */
async function credentials() {
  const { refreshTokenAuth } = await import("gsab-js/node");
  if (process.env.GSAB_REFRESH_TOKEN) return refreshTokenAuth();
  if (process.env.VERCEL) {
    // Deployed without write credentials: fail with something a visitor can understand.
    throw Object.assign(new Error("Demo writes aren't configured on this deployment yet — reads are still live."), {
      name: "DemoConfigError",
    });
  }
  const { loopbackAuth } = await import("gsab-js/node");
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
