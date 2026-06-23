import Reveal from "../components/Reveal";
import CopyButton from "../components/CopyButton";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { GITHUB } from "../lib/links";

/* ---- hero sheet data ---- */
const FIELDS = ["id", "name", "email", "plan", "secret"];
const ROWS = [
  ["101", "Ada Lovelace", "ada@calc.org", "pro", "••••••"],
  ["102", "Alan Turing", "alan@enigma.io", "free", "••••••"],
  ["103", "Grace Hopper", "grace@navy.mil", "pro", "••••••"],
  ["104", "Katherine Johnson", "kj@nasa.gov", "pro", "••••••"],
  ["105", "Linus Torvalds", "linus@kernel.org", "free", "••••••"],
  ["106", "Margaret Hamilton", "mh@mit.edu", "team", "••••••"],
];

function buildCells() {
  const letters = ["A", "B", "C", "D", "E"];
  const out = [{ cls: "gcell gcell--corner", t: "" }];
  letters.forEach((l) => out.push({ cls: "gcell gcell--colhead", t: l }));
  out.push({ cls: "gcell gcell--rownum", t: "1" });
  FIELDS.forEach((f) =>
    out.push({ cls: "gcell gcell--field", t: f, lock: f === "secret" })
  );
  ROWS.forEach((row, ri) => {
    out.push({ cls: "gcell gcell--rownum", t: String(ri + 2) });
    row.forEach((v, ci) => {
      let cls = "gcell gcell--val";
      if (ci === 4) cls = "gcell gcell--enc";
      if (ci === 3 && ri === 0) cls = "gcell gcell--val gcell--active";
      out.push({ cls, t: v });
    });
  });
  return out;
}
const CELLS = buildCells();

/* ---- feature tiles ---- */
const TILES = [
  {
    w: 2,
    glyph: "↵",
    title: "Sign in once",
    desc: "Browser sign-in with the minimal drive.file scope — no Cloud project, no JSON keys to wrangle.",
    chips: ["gsab auth login", "--full", "service account"],
    href: "/docs#auth",
  },
  {
    w: 1,
    glyph: "▤",
    title: "Typed schemas",
    desc: "Fields, types, validation rules and uniqueness — enforced on every write.",
    chips: ["Schema", "Field", "FieldType"],
    href: "/docs#schema",
  },
  {
    w: 1,
    glyph: "⇄",
    title: "Async CRUD",
    desc: "The four verbs you expect, with filter queries.",
    chips: ["insert()", "read()", "update()", "delete()"],
    href: "/docs#crud",
  },
  {
    w: 2,
    glyph: "◆",
    title: "Field encryption",
    desc: "Flag a field as encrypted and GSAB seals it with Fernet before it ever reaches the sheet.",
    chips: ["Field(encrypted=True)"],
    href: "/docs#encryption",
  },
  {
    w: 2,
    glyph: "❯",
    title: "Terminal-native CLI",
    desc: "Manage auth and data straight from your shell — scriptable by design.",
    chips: ["gsab auth login", "gsab auth status", "gsab version"],
    href: "/docs#cli",
  },
  {
    w: 1,
    glyph: "✦",
    title: "Built to grow",
    desc: "An MCP server, a terminal UI and a real-time mode are on the roadmap.",
    chips: ["MCP", "TUI", "real-time"],
    href: "/docs#roadmap",
  },
];

const codeHtml = `<span class="tok-com"># pip install gsab   ·   gsab auth login</span>
<span class="tok-key">import</span> asyncio
<span class="tok-key">from</span> gsab <span class="tok-key">import</span> SheetConnection, Schema, Field, FieldType, SheetManager

schema = <span class="tok-fn">Schema</span>(<span class="tok-str">"users"</span>, [
    <span class="tok-fn">Field</span>(<span class="tok-str">"id"</span>, FieldType.INTEGER, required=<span class="tok-key">True</span>, unique=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"email"</span>, FieldType.STRING, required=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"secret"</span>, FieldType.STRING, encrypted=<span class="tok-key">True</span>),
])

<span class="tok-key">async def</span> <span class="tok-fn">main</span>():
    db = <span class="tok-fn">SheetManager</span>(SheetConnection(), schema, encryption_key=KEY)
    <span class="tok-key">await</span> db.<span class="tok-fn">create_sheet</span>(<span class="tok-str">"My App DB"</span>)
    <span class="tok-key">await</span> db.<span class="tok-fn">insert</span>({<span class="tok-str">"id"</span>: 101, <span class="tok-str">"email"</span>: <span class="tok-str">"ada@calc.org"</span>, <span class="tok-str">"secret"</span>: <span class="tok-str">"hunter2"</span>})
    <span class="tok-mut">print</span>(<span class="tok-key">await</span> db.<span class="tok-fn">read</span>({<span class="tok-str">"id"</span>: 101}))

asyncio.<span class="tok-fn">run</span>(main())`;

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* ---------------- hero ---------------- */}
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <span className="eyebrow">Python · CLI · Open source</span>
              <h1 className="display">
                Google Sheets,
                <br />
                as your <em>backend</em>.
              </h1>
              <p className="hero__lead">
                GSAB gives you a database-like interface over Google Sheets — schemas,
                validation, encryption and async CRUD. Sign in once; no Google Cloud setup
                required.
              </p>
              <div className="hero__cta">
                <a className="btn btn--primary" href="#start">
                  Get started
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <a className="btn btn--ghost" href="/docs">
                  Read the docs
                </a>
              </div>
              <div className="hero__meta">
                <span>v0.2.0</span>
                <span>MIT licensed</span>
                <span>Python 3.9+</span>
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <div className="gs">
                <div className="gs__chrome">
                  <span className="gs__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="gs__title">My App DB</span>
                  <span className="gs__scope">drive.file</span>
                </div>
                <div className="gs__tabs">
                  <span className="is-active">users</span>
                  <span>plans</span>
                  <span className="gs__tabadd">+</span>
                </div>
                <div className="gs__formula">
                  <span className="gs__fx">fx</span>
                  <code>{'db.read({ "plan": "pro" })'}</code>
                </div>
                <div className="gs__grid">
                  {CELLS.map((c, i) => (
                    <div
                      key={i}
                      className={c.cls}
                      style={{ animationDelay: `${0.1 + i * 0.011}s` }}
                    >
                      {c.t}
                      {c.lock ? <span className="gs__lock"> ⊟</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- features (tiles) ---------------- */}
        <section className="band" id="features">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">What you get</span>
              <h2>A spreadsheet that behaves like a database.</h2>
              <p>
                Everything you'd reach for in an ORM, mapped onto a surface you already know how
                to read, share and audit.
              </p>
            </Reveal>
            <Reveal className="tiles" delay={60}>
              {TILES.map((t) => (
                <a className={`tile tile--w${t.w}`} key={t.title} href={t.href}>
                  <div className="tile__body">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <div className="tile__chips">
                      {t.chips.map((c) => (
                        <code key={c}>{c}</code>
                      ))}
                    </div>
                  </div>
                  <div className="tile__foot">
                    <span className="tile__cta">
                      Open docs <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------- quickstart ---------------- */}
        <section className="band" id="start">
          <div className="wrap">
            <Reveal className="section-head section-head--center">
              <span className="eyebrow">Two-minute start</span>
              <h2>From install to first row.</h2>
              <p>Install it, sign in, define a schema. That's the whole ceremony.</p>
            </Reveal>

            <Reveal as="ol" className="steprow" delay={40}>
              <li className="stepcard">
                <span className="stepcard__n">01</span>
                <h4>Install</h4>
                <p>
                  <code>pip install gsab</code> — one dependency-light package.
                </p>
              </li>
              <li className="stepcard">
                <span className="stepcard__n">02</span>
                <h4>Sign in</h4>
                <p>
                  <code>gsab auth login</code> opens your browser. GSAB only touches the sheets
                  it creates.
                </p>
              </li>
              <li className="stepcard">
                <span className="stepcard__n">03</span>
                <h4>Define &amp; write</h4>
                <p>Declare a typed schema and start inserting — validation included.</p>
              </li>
            </Reveal>

            <Reveal className="editor editor--wide" delay={120}>
              <div className="editor__bar">
                <i />
                <i />
                <i />
                <span className="editor__file">app.py</span>
              </div>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: codeHtml }} />
              </pre>
            </Reveal>
          </div>
        </section>

        {/* ---------------- auth modes ---------------- */}
        <section className="band" id="auth">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">Friction-free auth</span>
              <h2>Two ways in.</h2>
              <p>
                Pick the path that fits. The easy one needs nothing from Google Cloud; the DIY
                one hands you the keys.
              </p>
            </Reveal>
            <div className="modes">
              <Reveal className="mode mode--easy">
                <span className="mode__tag">Easy mode · default</span>
                <h3>Just sign in</h3>
                <p>
                  One browser sign-in with the minimal <code>drive.file</code> scope — no Cloud
                  project, no consent-screen wall. GSAB manages the sheets it creates for you.
                </p>
                <div className="mode__cmd">
                  <span className="tok-key">$</span> gsab auth login
                </div>
              </Reveal>

              <Reveal className="mode" delay={100}>
                <span className="mode__tag">DIY mode</span>
                <h3>Bring your own</h3>
                <p>Reach your existing sheets or wire up your own credentials.</p>
                <ul>
                  <li>
                    <code>--full</code> for access to all your sheets
                  </li>
                  <li>
                    <code>--client-secrets</code> for your own OAuth app
                  </li>
                  <li>gcloud ADC &amp; service accounts, auto-detected</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- roadmap ---------------- */}
        <section className="band" id="roadmap">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">Roadmap</span>
              <h2>Built in the open.</h2>
              <p>What ships in 0.3.0 today, and what&apos;s coming next.</p>
            </Reveal>
            <div className="modes">
              <Reveal className="mode mode--easy">
                <span className="mode__tag">Shipped · v0.3.0</span>
                <h3>Available now</h3>
                <ul className="rm-done">
                  <li>Friction-free auth (drive.file) + CLI</li>
                  <li>Schemas, validation &amp; field encryption</li>
                  <li>Async CRUD with rich filters</li>
                  <li>Type-correct server-side query() — Google Visualization</li>
                  <li>pandas to_dataframe / from_dataframe + bulk_insert</li>
                  <li>Native in-sheet charts via chart()</li>
                  <li>LLM-friendly errors + retry/backoff</li>
                  <li>OS-keychain token storage</li>
                </ul>
              </Reveal>
              <Reveal className="mode" delay={100}>
                <span className="mode__tag">On the way</span>
                <h3>Coming next</h3>
                <ul>
                  <li>MCP server — use your sheets from Claude</li>
                  <li>Terminal UI (TUI)</li>
                  <li>Real-time / reactive mode</li>
                  <li>Server-side date filters</li>
                  <li>One-click hosted sign-in</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- closing ---------------- */}
        <section className="closing">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">Ship it</span>
              <h2>
                Your next backend is <em>one sheet</em> away.
              </h2>
              <p>
                Prototype, ship a side project, or back a small app — without standing up a
                database.
              </p>
              <div className="closing__cta">
                <CopyButton text="pip install gsab" />
                <a className="btn btn--primary" href="/docs">
                  Read the docs
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
