import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import TeamDirectory from "../../components/TeamDirectory";
import { DEMO_SHEET_URL } from "../../lib/demo-shared";

export const metadata = {
  title: "Live demo — GSAB",
  description:
    "A user-management table backed by a real, public Google Sheet — reads happen in your browser with gsab-js, writes go through the Sheets API. Edit it and watch it sync.",
};

export default function Demo() {
  return (
    <>
      <SiteHeader />
      <main className="docs">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <header className="docs__hero">
            <span className="eyebrow">Live demo · Experimental</span>
            <h1 className="display">A team directory, running on a spreadsheet</h1>
            <p>
              This table's database is a{" "}
              <a href={DEMO_SHEET_URL} target="_blank" rel="noreferrer">
                public Google Sheet
              </a>
              . Your browser reads it directly with the <code>gsab</code> JS client — no auth, no
              API key — and polls for changes, so edits made by anyone (including directly in the
              sheet) show up here within a few seconds. Writes go through this site's server using
              the same library in Node. It's a shared toy: capped at 30 rows, rate-limited, and
              reset periodically.
            </p>
          </header>

          <TeamDirectory />

          <section className="doc-sec">
            <h2>What this page actually runs</h2>
            <pre>
              <code>{`// in your browser (no auth — it's a public sheet)
import { connect } from "gsab";
import { useSheet } from "gsab/react";

const db = connect("<sheet url or id>").sheet();
const { rows, loading, error } = useSheet(db, { key: "id" });

// on the server (writes need a Google sign-in)
import { connect } from "gsab";
const db = connect({ spreadsheetId, auth }).sheet(schema);
await db.insert({ id: 5, name: "You", email: "you@example.com" });`}</code>
            </pre>
            <p>
              The JS client is early and not yet on npm —{" "}
              <a href="https://github.com/ajmalaksar25/gsab-js" target="_blank" rel="noreferrer">
                github.com/ajmalaksar25/gsab-js
              </a>
              . The Python library it mirrors is{" "}
              <a href="https://pypi.org/project/gsab/" target="_blank" rel="noreferrer">
                on PyPI
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
