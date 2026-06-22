import Reveal from "../components/Reveal";
import CopyButton from "../components/CopyButton";

const GITHUB = "https://github.com/ajmalaksar25/gsab";
const PYPI = "https://pypi.org/project/gsab/";
const SITE = "https://ajmalaksar.com";

const cells = [
  { t: "", cls: "cellx--corner" },
  { t: "id", cls: "cellx--colhead" },
  { t: "email", cls: "cellx--colhead" },
  { t: "secret", cls: "cellx--colhead", lock: true },
  { t: "1", cls: "cellx--rowhead" },
  { t: "101", cls: "cellx--val" },
  { t: "ada@calc.org", cls: "cellx--val" },
  { t: "••••••", cls: "cellx--enc" },
  { t: "2", cls: "cellx--rowhead" },
  { t: "102", cls: "cellx--val" },
  { t: "alan@enigma.io", cls: "cellx--val" },
  { t: "••••••", cls: "cellx--enc" },
  { t: "3", cls: "cellx--rowhead" },
  { t: "103", cls: "cellx--val" },
  { t: "grace@navy.mil", cls: "cellx--val" },
  { t: "••••••", cls: "cellx--enc" },
];

const features = [
  {
    coord: "A1",
    icon: "↵",
    title: "Sign in, that's it",
    body: "gsab auth login opens your browser. No Cloud project, no JSON keys to wrangle.",
  },
  {
    coord: "B1",
    icon: "▤",
    title: "Real schemas",
    body: "Typed fields, validation rules and uniqueness — enforced on every write.",
  },
  {
    coord: "C1",
    icon: "◆",
    title: "Field encryption",
    body: "Flag a field as encrypted and GSAB seals it before it ever reaches the sheet.",
  },
  {
    coord: "A2",
    icon: "⇄",
    title: "Async CRUD",
    body: "insert · read · update · delete, with familiar filter queries.",
  },
  {
    coord: "B2",
    icon: "❯",
    title: "A proper CLI",
    body: "Manage auth and data straight from your terminal — scriptable by design.",
  },
  {
    coord: "C2",
    icon: "✦",
    title: "Built to grow",
    body: "An MCP server, a terminal UI and a real-time mode are on the roadmap.",
  },
];

const codeHtml = `<span class="tok-com"># pip install gsab   ·   gsab auth login</span>
<span class="tok-key">from</span> gsab <span class="tok-key">import</span> SheetConnection, Schema, Field, FieldType, SheetManager

schema = <span class="tok-fn">Schema</span>(<span class="tok-str">"users"</span>, [
    <span class="tok-fn">Field</span>(<span class="tok-str">"id"</span>, FieldType.INTEGER, required=<span class="tok-key">True</span>, unique=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"email"</span>, FieldType.STRING, required=<span class="tok-key">True</span>),
    <span class="tok-fn">Field</span>(<span class="tok-str">"secret"</span>, FieldType.STRING, encrypted=<span class="tok-key">True</span>),
])

<span class="tok-key">async def</span> <span class="tok-fn">main</span>():
    db = <span class="tok-fn">SheetManager</span>(SheetConnection(), schema)
    <span class="tok-key">await</span> db.<span class="tok-fn">create_sheet</span>(<span class="tok-str">"My App DB"</span>)
    <span class="tok-key">await</span> db.<span class="tok-fn">insert</span>({<span class="tok-str">"id"</span>: 101, <span class="tok-str">"email"</span>: <span class="tok-str">"ada@calc.org"</span>, <span class="tok-str">"secret"</span>: <span class="tok-str">"hunter2"</span>})
    <span class="tok-mut">print</span>(<span class="tok-key">await</span> db.<span class="tok-fn">read</span>({<span class="tok-str">"id"</span>: 101}))`;

export default function Home() {
  return (
    <>
      <header className="site-head">
        <div className="wrap site-head__inner">
          <a className="brand" href="#top">
            <span className="brand__mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            GSAB
          </a>
          <nav className="site-nav">
            <a className="hide-sm" href="#start">
              Quickstart
            </a>
            <a className="hide-sm" href="#auth">
              Auth
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="nav-cta" href={PYPI} target="_blank" rel="noreferrer">
              PyPI ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* hero */}
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
                <a className="btn btn--ghost" href={GITHUB} target="_blank" rel="noreferrer">
                  View on GitHub
                </a>
              </div>
              <div className="hero__meta">
                <span>v0.2.0</span>
                <span>MIT licensed</span>
                <span>Python 3.9+</span>
              </div>
            </div>

            <div className="hero__visual" aria-hidden="true">
              <div className="sheet">
                <div className="sheet__bar">
                  <span className="sheet__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="sheet__title">My App DB · users</span>
                  <span className="sheet__scope">scope: drive.file</span>
                </div>
                <div className="sheet__grid">
                  {cells.map((c, i) => (
                    <div key={i} className={`cellx ${c.cls}`}>
                      {c.t}
                      {c.lock ? <span className="lock"> ⊟</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* features */}
        <section className="band">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">What you get</span>
              <h2>A spreadsheet that behaves like a database.</h2>
              <p>
                Every cell you'd expect from an ORM, mapped onto a surface you already know how
                to read, share and audit.
              </p>
            </Reveal>
            <Reveal className="features" delay={80}>
              {features.map((f) => (
                <div className="feature" key={f.coord}>
                  <span className="feature__coord">{f.coord}</span>
                  <div className="feature__icon" aria-hidden="true">
                    {f.icon}
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* quickstart */}
        <section className="band" id="start">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="eyebrow">Two-minute start</span>
              <h2>From install to first row.</h2>
              <p>Install it, sign in, define a schema. That's the whole ceremony.</p>
            </Reveal>
            <div className="start__grid">
              <Reveal as="ol" className="steps">
                <li className="step">
                  <span className="step__n">1</span>
                  <div>
                    <h4>Install</h4>
                    <p>
                      <code>pip install gsab</code> — one dependency-light package.
                    </p>
                  </div>
                </li>
                <li className="step">
                  <span className="step__n">2</span>
                  <div>
                    <h4>Sign in</h4>
                    <p>
                      <code>gsab auth login</code> opens your browser. GSAB only touches the
                      sheets it creates.
                    </p>
                  </div>
                </li>
                <li className="step">
                  <span className="step__n">3</span>
                  <div>
                    <h4>Define &amp; write</h4>
                    <p>Declare a typed schema and start inserting — validation included.</p>
                  </div>
                </li>
              </Reveal>

              <Reveal className="editor" delay={120}>
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
          </div>
        </section>

        {/* auth modes */}
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

        {/* closing */}
        <section className="closing">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">Ship it</span>
              <h2>
                Your next backend is <em>one sheet</em> away.
              </h2>
              <p>Prototype, ship a side project, or back a small app — without standing up a database.</p>
              <div className="closing__cta">
                <CopyButton text="pip install gsab" />
                <a className="btn btn--primary" href={GITHUB} target="_blank" rel="noreferrer">
                  Star on GitHub
                  <span className="btn__arrow" aria-hidden="true">
                    ★
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot__inner">
          <div className="foot__brand">
            GSAB
            <span>Google Sheets as a Backend</span>
          </div>
          <nav className="foot__links">
            <a href={PYPI} target="_blank" rel="noreferrer">
              PyPI
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="#start">Quickstart</a>
            <a href="#auth">Auth</a>
          </nav>
          <div className="foot__by">
            Built by{" "}
            <a href={SITE} target="_blank" rel="noreferrer">
              Ajmal Aksar
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
