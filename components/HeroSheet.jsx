"use client";

// The hero "spreadsheet" is not a mock — it's the live demo sheet, read right here in the
// visitor's browser with gsab-js (no auth: it's a public sheet). Falls back to the seed rows
// while the first snapshot loads (and for the prerendered HTML), so it never renders empty.
import { connect } from "gsab-js";
import { useSheet } from "gsab-js/react";

import { DEMO_SHEET_ID } from "../lib/demo-shared";

const db = connect(DEMO_SHEET_ID).sheet();

const FIELDS = ["id", "name", "email", "role", "status"];
const FALLBACK = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "admin", status: "active" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com", role: "member", status: "active" },
  { id: 3, name: "Alan Turing", email: "alan@example.com", role: "member", status: "invited" },
  { id: 4, name: "Katherine Johnson", email: "katherine@example.com", role: "viewer", status: "active" },
];

export default function HeroSheet() {
  const { rows, loading } = useSheet(db, { key: "id", interval: 3000 });
  const live = !loading && rows.length > 0;
  const data = (live ? [...rows].sort((a, b) => Number(a.id) - Number(b.id)) : FALLBACK).slice(0, 6);
  const active = data.filter((r) => String(r.status) === "active").length;

  const letters = ["A", "B", "C", "D", "E"];
  const cells = [{ cls: "gcell gcell--corner", t: "" }];
  letters.forEach((l) => cells.push({ cls: "gcell gcell--colhead", t: l }));
  cells.push({ cls: "gcell gcell--rownum", t: "1" });
  FIELDS.forEach((f) => cells.push({ cls: "gcell gcell--field", t: f }));
  data.forEach((row, ri) => {
    cells.push({ cls: "gcell gcell--rownum", t: String(ri + 2) });
    FIELDS.forEach((f, ci) => {
      let cls = "gcell gcell--val";
      if (f === "status") cls += ` demo-status--${String(row[f])}`;
      if (ci === 3 && ri === 0) cls += " gcell--active";
      cells.push({ cls, t: String(row[f] ?? "") });
    });
  });

  return (
    <>
      <div className="gs" aria-hidden="true">
        <div className="gs__chrome">
          <span className="gs__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="gs__title">GSAB Demo — Team Directory</span>
          <span className="gs__scope">drive.file</span>
        </div>
        <div className="gs__tabs">
          <span className="is-active">team</span>
          <span className="gs__tabadd">+</span>
        </div>
        <div className="gs__formula">
          <span className="gs__fx">fx</span>
          <code>{'useSheet(db, { key: "id" })'}</code>
        </div>
        <div className="gs__grid">
          {cells.map((c, i) => (
            <div key={i} className={c.cls} style={{ animationDelay: `${0.1 + i * 0.011}s` }}>
              {c.t}
            </div>
          ))}
        </div>
      </div>
      <a className="gs__live" href="/demo">
        <span className={`demo-live__dot${live ? "" : " gs__live-dot--warming"}`} />
        {live ? "a real Google Sheet, live" : "a real Google Sheet, connecting"} · {data.length}{" "}
        people · {active} active — play with it →
      </a>
    </>
  );
}
