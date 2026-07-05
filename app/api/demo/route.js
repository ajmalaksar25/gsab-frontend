// Write API for the /demo Team Directory. Reads never come through here — the browser
// reads the public sheet directly with gsab-js. POST = add, PATCH = edit, DELETE = remove,
// PUT = reset to the seed rows. Everything is capped + rate-limited: it's a shared toy.
import { NextResponse } from "next/server";
import { teamDb, rateLimited, MAX_ROWS, SEED_ROWS } from "../../../lib/demo";
import { ROLES, STATUSES } from "../../../lib/demo-shared";

function bad(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function guard(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return bad("Rate limit hit — this is a shared demo, try again in a minute.", 429);
  return null;
}

/** Map a gsab error to an honest HTTP response (the messages are already end-user friendly). */
function fromGsab(e) {
  const name = e?.name ?? "";
  if (name === "DemoConfigError") return bad(e.message, 503);
  if (name === "ValidationError") return bad(e.message, 400);
  if (name === "DuplicateKeyError") return bad(e.message, 409);
  if (name === "QuotaExceededError") return bad(e.message, 429);
  console.error("demo API:", e);
  return bad(e?.message ?? "Sheet write failed.", 502);
}

function cleanFields(body) {
  const out = {};
  if (body.name !== undefined) out.name = String(body.name).trim().slice(0, 60);
  if (body.email !== undefined) out.email = String(body.email).trim().slice(0, 80);
  if (body.role !== undefined) {
    if (!ROLES.includes(body.role)) throw bad(`role must be one of ${ROLES.join(", ")}`);
    out.role = body.role;
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) throw bad(`status must be one of ${STATUSES.join(", ")}`);
    out.status = body.status;
  }
  return out;
}

export async function POST(request) {
  const limited = guard(request);
  if (limited) return limited;
  try {
    const fields = cleanFields(await request.json());
    if (!fields.name || !fields.email) return bad("name and email are required.");
    const db = await teamDb();
    const rows = await db.read();
    if (rows.length >= MAX_ROWS) {
      return bad(`Demo cap: ${MAX_ROWS} rows. Delete someone (or reset) first.`, 409);
    }
    const id = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const row = { id, ...fields };
    await db.insert(row);
    return NextResponse.json({ row }, { status: 201 });
  } catch (e) {
    return e instanceof NextResponse ? e : fromGsab(e);
  }
}

export async function PATCH(request) {
  const limited = guard(request);
  if (limited) return limited;
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) return bad("id (integer) is required.");
    const fields = cleanFields(body);
    delete fields.id;
    if (!Object.keys(fields).length) return bad("nothing to update.");
    const db = await teamDb();
    const n = await db.update({ id }, fields);
    if (!n) return bad(`No row with id ${id} — someone may have deleted it.`, 404);
    return NextResponse.json({ updated: n });
  } catch (e) {
    return e instanceof NextResponse ? e : fromGsab(e);
  }
}

export async function DELETE(request) {
  const limited = guard(request);
  if (limited) return limited;
  try {
    const { id } = await request.json();
    if (!Number.isInteger(Number(id))) return bad("id (integer) is required.");
    const db = await teamDb();
    const n = await db.delete({ id: Number(id) });
    if (!n) return bad(`No row with id ${id} — someone may have deleted it.`, 404);
    return NextResponse.json({ deleted: n });
  } catch (e) {
    return fromGsab(e);
  }
}

export async function PUT(request) {
  const limited = guard(request);
  if (limited) return limited;
  try {
    const db = await teamDb();
    for (const row of await db.read()) await db.delete({ id: row.id });
    await db.bulkInsert(SEED_ROWS);
    return NextResponse.json({ reset: true, rows: SEED_ROWS.length });
  } catch (e) {
    return fromGsab(e);
  }
}
