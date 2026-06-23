// Regenerate public/docs/<slug>.md, public/llms.txt and public/llms-full.txt
// from content/docs/*.md so they never drift from the rendered docs.
// Run via `npm run docs` (also wired as prebuild).

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "content", "docs");
const PUB = path.join(ROOT, "public");
const SITE = "https://gsab.ajmalaksar.com";

const docs = fs
  .readdirSync(DOCS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(DOCS_DIR, f), "utf8"));
    return {
      slug: f.replace(/\.md$/, ""),
      title: data.title || f,
      order: data.order ?? 999,
      summary: data.summary || "",
      content: content.trim(),
    };
  })
  .sort((a, b) => a.order - b.order);

// 1) per-page raw markdown at /docs/<slug>.md
const outDocs = path.join(PUB, "docs");
fs.mkdirSync(outDocs, { recursive: true });
for (const d of docs) fs.writeFileSync(path.join(outDocs, `${d.slug}.md`), `${d.content}\n`);

// 2) llms.txt — concise index (llmstxt.org standard)
const llms = [
  "# GSAB — Google Sheets as a Backend",
  "",
  "> A database-like Python library + CLI for Google Sheets: typed schemas, validation,",
  "> field encryption, async CRUD, and server-side queries. Sign in once with",
  "> `gsab auth login` — no Google Cloud project required.",
  "",
  'Install: `pip install gsab` (add `pip install "gsab[pandas]"` for DataFrames). Python 3.9+.',
  "",
  "## Docs",
  ...docs.map((d) => `- [${d.title}](${SITE}/docs/${d.slug}.md): ${d.summary}`),
  "",
  "## More",
  `- [Full docs as one file](${SITE}/llms-full.txt)`,
  "- [PyPI](https://pypi.org/project/gsab/)",
  "- [GitHub](https://github.com/ajmalaksar25/gsab)",
  "",
].join("\n");
fs.writeFileSync(path.join(PUB, "llms.txt"), llms);

// 3) llms-full.txt — the whole documentation as one file
const fullHeader = [
  "# GSAB — Google Sheets as a Backend (complete documentation)",
  "",
  `Generated from the GSAB docs. Source: ${SITE}/docs · PyPI: https://pypi.org/project/gsab/`,
].join("\n");
const full = [fullHeader, ...docs.map((d) => d.content)].join("\n\n---\n\n") + "\n";
fs.writeFileSync(path.join(PUB, "llms-full.txt"), full);

console.log(`docs artifacts: ${docs.length} pages + llms.txt + llms-full.txt`);
