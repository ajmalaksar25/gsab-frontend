import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import TeamDirectory from "../../components/TeamDirectory";
import CodeTabs from "../../components/CodeTabs";
import { DEMO_SHEET_URL } from "../../lib/demo-shared";

const jsCode = `<span class="tok-com">// in your browser — no auth, it's a public sheet</span>
<span class="tok-key">import</span> { connect } <span class="tok-key">from</span> <span class="tok-str">"gsab-js"</span>;
<span class="tok-key">import</span> { useSheet } <span class="tok-key">from</span> <span class="tok-str">"gsab-js/react"</span>;

<span class="tok-key">const</span> db = <span class="tok-fn">connect</span>(<span class="tok-str">"&lt;sheet url or id&gt;"</span>).<span class="tok-fn">sheet</span>();
<span class="tok-key">const</span> { rows, loading, error } = <span class="tok-fn">useSheet</span>(db, { key: <span class="tok-str">"id"</span> });

<span class="tok-com">// on the server — writes need a Google sign-in</span>
<span class="tok-key">import</span> { refreshTokenAuth } <span class="tok-key">from</span> <span class="tok-str">"gsab-js/node"</span>;
<span class="tok-key">const</span> db = <span class="tok-fn">connect</span>({ spreadsheetId, auth: <span class="tok-fn">refreshTokenAuth</span>() }).<span class="tok-fn">sheet</span>(schema);
<span class="tok-key">await</span> db.<span class="tok-fn">insert</span>({ id: 5, name: <span class="tok-str">"You"</span>, email: <span class="tok-str">"you@example.com"</span> });`;

const pyCode = `<span class="tok-com"># the same sheet, from Python — pip install gsab · gsab auth login</span>
<span class="tok-key">import</span> asyncio
<span class="tok-key">from</span> gsab <span class="tok-key">import</span> SheetConnection, SheetManager, Schema, Field, FieldType

schema = <span class="tok-fn">Schema</span>(<span class="tok-str">"team"</span>, [
    <span class="tok-fn">Field</span>(<span class="tok-str">"id"</span>, FieldType.INTEGER, required=<span class="tok-key">True</span>, unique=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"name"</span>, FieldType.STRING, required=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"email"</span>, FieldType.STRING, required=<span class="tok-key">True</span>),
])

<span class="tok-key">async def</span> <span class="tok-fn">main</span>():
    db = <span class="tok-fn">SheetManager</span>(SheetConnection(), schema)
    <span class="tok-key">await</span> db.<span class="tok-fn">insert</span>({<span class="tok-str">"id"</span>: 5, <span class="tok-str">"name"</span>: <span class="tok-str">"You"</span>, <span class="tok-str">"email"</span>: <span class="tok-str">"you@example.com"</span>})
    <span class="tok-mut">print</span>(<span class="tok-key">await</span> db.<span class="tok-fn">read</span>({<span class="tok-str">"status"</span>: <span class="tok-str">"active"</span>}))

asyncio.<span class="tok-fn">run</span>(main())`;

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
            <CodeTabs
              chrome
              tabs={[
                { label: "JavaScript", file: "TeamDirectory.jsx" },
                { label: "Python", file: "team_directory.py" },
              ]}
              panels={[
                <pre key="js">
                  <code dangerouslySetInnerHTML={{ __html: jsCode }} />
                </pre>,
                <pre key="py">
                  <code dangerouslySetInnerHTML={{ __html: pyCode }} />
                </pre>,
              ]}
            />
            <p>
              Try it yourself: <code>npm install gsab-js</code> —{" "}
              <a href="https://www.npmjs.com/package/gsab-js" target="_blank" rel="noreferrer">
                npm
              </a>{" "}
              ·{" "}
              <a href="https://github.com/ajmalaksar25/gsab-js" target="_blank" rel="noreferrer">
                GitHub
              </a>
              . Early (0.2.x) and moving fast. The Python library it mirrors is{" "}
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
