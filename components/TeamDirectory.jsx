"use client";

// The /demo Team Directory: a live table over a real public Google Sheet.
// Reads happen RIGHT HERE in the browser via gsab-js (`useSheet` polls + diffs the sheet);
// writes go through /api/demo, which uses gsab-js in Node with the demo's own credentials.
import { useState } from "react";
import { connect } from "gsab-js";
import { useSheet } from "gsab-js/react";

import { DEMO_SHEET_ID, DEMO_SHEET_URL, ROLES, STATUSES } from "../lib/demo-shared";

const db = connect(DEMO_SHEET_ID).sheet(); // public no-auth read, module scope

export default function TeamDirectory() {
  const { rows, loading, error, refresh } = useSheet(db, { key: "id", interval: 2500 });
  const [busy, setBusy] = useState(false);
  const [writeError, setWriteError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "member" });

  async function call(method, body) {
    setBusy(true);
    setWriteError(null);
    try {
      const res = await fetch("/api/demo", {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
      await refresh(); // pull the write back through the live read path immediately
      return true;
    } catch (e) {
      setWriteError(e.message || String(e));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function add(e) {
    e.preventDefault();
    if (await call("POST", form)) setForm({ name: "", email: "", role: "member" });
  }

  const sorted = [...rows].sort((a, b) => Number(a.id) - Number(b.id));

  return (
    <div className="demo-card">
      <div className="demo-toolbar">
        <span className={`demo-live${error ? " demo-live--down" : ""}`}>
          <span className="demo-live__dot" />
          {error ? "sheet unreachable — showing last known rows" : "live from Google Sheets"}
        </span>
        <span className="demo-count">{loading ? "…" : `${sorted.length} people`}</span>
        <a href={DEMO_SHEET_URL} target="_blank" rel="noreferrer">
          open the actual sheet ↗
        </a>
        <button className="demo-reset" disabled={busy} onClick={() => call("PUT")}>
          reset demo
        </button>
      </div>

      {writeError && <p className="demo-error">{writeError}</p>}

      {loading ? (
        <p className="demo-loading">Reading the sheet…</p>
      ) : (
        <table className="demo-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={String(r.id)}>
                <td className="demo-id">{String(r.id)}</td>
                <td>{String(r.name ?? "")}</td>
                <td className="demo-email">{String(r.email ?? "")}</td>
                <td>
                  <select
                    value={String(r.role ?? "member")}
                    disabled={busy}
                    onChange={(e) => call("PATCH", { id: r.id, role: e.target.value })}
                  >
                    {ROLES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className={`demo-status demo-status--${String(r.status)}`}
                    value={String(r.status ?? "active")}
                    disabled={busy}
                    onChange={(e) => call("PATCH", { id: r.id, status: e.target.value })}
                  >
                    {STATUSES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="demo-del"
                    title="Remove"
                    disabled={busy}
                    onClick={() => call("DELETE", { id: r.id })}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            {!sorted.length && (
              <tr>
                <td colSpan={6} className="demo-empty">
                  Nobody here — add someone below, or hit “reset demo”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <form className="demo-add" onSubmit={add}>
        <input
          placeholder="Full name"
          value={form.name}
          maxLength={60}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="email@company.com"
          type="email"
          value={form.email}
          maxLength={80}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {ROLES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Working…" : "Add person"}
        </button>
      </form>
    </div>
  );
}
