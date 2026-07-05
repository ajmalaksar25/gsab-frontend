import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import TeamDirectory from "../../components/TeamDirectory";
import { DEMO_SHEET_URL } from "../../lib/demo-shared";

const demoCode = `<span class="tok-com">// in your browser — no auth, it's a public sheet</span>
<span class="tok-key">import</span> { connect } <span class="tok-key">from</span> <span class="tok-str">"gsab-js"</span>;
<span class="tok-key">import</span> { useSheet } <span class="tok-key">from</span> <span class="tok-str">"gsab-js/react"</span>;

<span class="tok-key">const</span> db = <span class="tok-fn">connect</span>(<span class="tok-str">"&lt;sheet url or id&gt;"</span>).<span class="tok-fn">sheet</span>();
<span class="tok-key">const</span> { rows, loading, error } = <span class="tok-fn">useSheet</span>(db, { key: <span class="tok-str">"id"</span> });

<span class="tok-com">// on the server — writes need a Google sign-in</span>
<span class="tok-key">import</span> { refreshTokenAuth } <span class="tok-key">from</span> <span class="tok-str">"gsab-js/node"</span>;
<span class="tok-key">const</span> db = <span class="tok-fn">connect</span>({ spreadsheetId, auth: <span class="tok-fn">refreshTokenAuth</span>() }).<span class="tok-fn">sheet</span>(schema);
<span class="tok-key">await</span> db.<span class="tok-fn">insert</span>({ id: 5, name: <span class="tok-str">"You"</span>, email: <span class="tok-str">"you@example.com"</span> });`;

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
            <div className="editor editor--wide demo-editor">
              <div className="editor__bar">
                <i />
                <i />
                <i />
                <span className="editor__file">TeamDirectory.jsx</span>
              </div>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: demoCode }} />
              </pre>
            </div>
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
