import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "GSAB Docs — usage & API",
  description:
    "How to use GSAB: install, authentication, schemas, async CRUD, field encryption and the CLI.",
};

const TOC = [
  { id: "install", label: "Install" },
  { id: "auth", label: "Authentication" },
  { id: "schema", label: "Schemas" },
  { id: "connect", label: "Connecting" },
  { id: "crud", label: "CRUD" },
  { id: "query", label: "Querying" },
  { id: "encryption", label: "Encryption" },
  { id: "cli", label: "CLI reference" },
  { id: "server", label: "Servers & CI" },
  { id: "roadmap", label: "Roadmap" },
];

function Code({ children }) {
  return (
    <pre className="doc-pre">
      <code>{children}</code>
    </pre>
  );
}

export default function Docs() {
  return (
    <>
      <SiteHeader />
      <main className="docs">
        <div className="wrap docs__grid">
          <aside className="docs__nav">
            <p className="docs__navhead">Documentation</p>
            <nav>
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {t.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="docs__body">
            <header className="docs__hero">
              <span className="eyebrow">Docs · v0.2.0</span>
              <h1 className="display">Using GSAB</h1>
              <p>
                GSAB is a Python library and CLI that treats a Google Spreadsheet like a
                database: a tab is a table, a schema gives it types and validation, and async
                methods give you CRUD. Everything below is the current API.
              </p>
            </header>

            <section id="install" className="doc-sec">
              <h2>Install</h2>
              <p>Python 3.9+.</p>
              <Code>{`pip install gsab`}</Code>
            </section>

            <section id="auth" className="doc-sec">
              <h2>Authentication</h2>
              <p>
                <strong>Easy mode (default).</strong> One browser sign-in with the minimal,
                non-sensitive <code>drive.file</code> scope. GSAB can then create and manage the
                sheets it owns — no Google Cloud project required from your users.
              </p>
              <Code>{`gsab auth login`}</Code>
              <p>
                <strong>DIY mode.</strong> Reach your existing sheets, or bring your own OAuth
                client.
              </p>
              <Code>{`gsab auth login --full              # access ALL your sheets (broader scope)
gsab auth login -c client_secret.json   # use your own OAuth client`}</Code>
              <p>Check or clear the cached token:</p>
              <Code>{`gsab auth status      # which credential sources are available
gsab auth logout      # remove the cached token`}</Code>
              <p>
                <strong>Non-interactive.</strong> The resolver auto-detects, in order: a cached
                login token → gcloud ADC → a service account. Point at a service account with an
                environment variable:
              </p>
              <Code>{`export GSAB_SERVICE_ACCOUNT=/path/to/service-account.json
# (GOOGLE_APPLICATION_CREDENTIALS is also honoured)`}</Code>
              <p>In code, credentials resolve automatically — or do it yourself:</p>
              <Code>{`from gsab import resolve_credentials

creds = resolve_credentials()        # cached token / ADC / service account`}</Code>
            </section>

            <section id="schema" className="doc-sec">
              <h2>Defining a schema</h2>
              <p>A schema names the tab and declares its fields.</p>
              <Code>{`from gsab import Schema, Field, FieldType

schema = Schema("users", [
    Field("id",    FieldType.INTEGER, required=True, unique=True),
    Field("name",  FieldType.STRING,  required=True, max_length=80),
    Field("email", FieldType.STRING,  pattern=r"[^@]+@[^@]+\\.[^@]+"),
    Field("age",   FieldType.INTEGER, min_value=0, max_value=150),
    Field("secret", FieldType.STRING, encrypted=True),
])`}</Code>
              <p>
                <strong>FieldType:</strong> <code>STRING</code>, <code>INTEGER</code>,{" "}
                <code>FLOAT</code>, <code>BOOLEAN</code>, <code>DATE</code>,{" "}
                <code>DATETIME</code>, <code>JSON</code>.
              </p>
              <p>
                <strong>Field options:</strong> <code>required</code>, <code>unique</code>,{" "}
                <code>default</code>, <code>min_length</code> / <code>max_length</code>,{" "}
                <code>pattern</code>, <code>min_value</code> / <code>max_value</code>,{" "}
                <code>encrypted</code>, and custom <code>validation_rules</code>. Validation runs
                on every write.
              </p>
            </section>

            <section id="connect" className="doc-sec">
              <h2>Connecting</h2>
              <p>
                <code>SheetConnection</code> resolves credentials and builds the API client. With
                no arguments it uses your cached login.
              </p>
              <Code>{`from gsab import SheetConnection

conn = SheetConnection()                 # easy mode (cached login)
await conn.connect()

# servers / CI:
conn = SheetConnection(service_account_file="service-account.json")`}</Code>
            </section>

            <section id="crud" className="doc-sec">
              <h2>CRUD</h2>
              <p>
                A <code>SheetManager</code> binds a connection to a schema and gives you async
                create / read / update / delete.
              </p>
              <Code>{`from gsab import SheetManager

db = SheetManager(conn, schema)
await db.create_sheet("My App DB")          # creates the spreadsheet, returns its id

await db.insert({"id": 101, "name": "Ada", "email": "ada@calc.org"})

# read everything, or filter:
rows = await db.read()
rows = await db.read({"plan": "pro"})              # equality
rows = await db.read({"name": {"$regex": "Ada"}})  # regex operator

await db.update({"id": 101}, {"plan": "team"})     # returns rows changed
await db.delete({"plan": "free"})                  # returns rows deleted

await db.delete_sheet()                            # remove the whole spreadsheet`}</Code>
              <p>
                <code>read()</code> returns a list of dicts. <code>update()</code> and{" "}
                <code>delete()</code> return how many rows matched.
              </p>
            </section>

            <section id="query" className="doc-sec">
              <h2>Querying</h2>
              <p>
                <code>read()</code> filters support operators:{" "}
                <code>$eq $ne $gt $gte $lt $lte $in $nin $contains $regex</code>.
              </p>
              <Code>{`await db.read({"age": {"$gte": 18}})
await db.read({"plan": {"$in": ["pro", "team"]}})
await db.read({"email": {"$contains": "@"}})`}</Code>
              <p>
                For server-side power — filtering, sorting and aggregation that run on Google's
                side, not in Python — use <code>query()</code> with the Google Visualization query
                language. Columns are letters; <code>column()</code> maps a field name to one.
              </p>
              <Code>{`rows = await db.query("SELECT A, D WHERE D = 'pro' ORDER BY A DESC LIMIT 10")

db.column("plan")   # -> "D"`}</Code>
            </section>

            <section id="encryption" className="doc-sec">
              <h2>Field encryption</h2>
              <p>
                Fields flagged <code>encrypted=True</code> are sealed with Fernet before they
                reach the sheet and decrypted on read. Pass an <code>encryption_key</code> to the
                manager.
              </p>
              <Code>{`from cryptography.fernet import Fernet

key = Fernet.generate_key().decode()   # store this safely, e.g. in an env var

db = SheetManager(conn, schema, encryption_key=key)`}</Code>
              <p>
                Without a key, fields are written as-is — so keep the key out of source control
                and stable across runs, or you won't be able to decrypt old rows.
              </p>
            </section>

            <section id="cli" className="doc-sec">
              <h2>CLI reference</h2>
              <Code>{`gsab --help

gsab version

gsab auth login   [--full] [--client-secrets PATH] [--no-browser]
gsab auth status  [--json]
gsab auth logout`}</Code>
            </section>

            <section id="server" className="doc-sec">
              <h2>Servers &amp; CI</h2>
              <p>
                For headless environments, use a service account. Create one in Google Cloud,
                download its key, and <strong>share the target spreadsheet with the service
                account's email</strong> so it can edit.
              </p>
              <Code>{`export GSAB_SERVICE_ACCOUNT=/path/to/service-account.json
python your_app.py     # SheetConnection() picks it up automatically`}</Code>
            </section>

            <section id="roadmap" className="doc-sec">
              <h2>Roadmap</h2>
              <ul className="doc-list">
                <li>
                  <strong>MCP server</strong> — use your sheets from Claude and other AI tools.
                </li>
                <li>
                  <strong>Terminal UI</strong> — browse tables and rows interactively.
                </li>
                <li>
                  <strong>Real-time mode</strong> — reactive reads, Convex-style.
                </li>
                <li>
                  <strong>Hosted easy-mode auth</strong> — one-click sign-in at gsab.ajmalaksar.com.
                </li>
              </ul>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
