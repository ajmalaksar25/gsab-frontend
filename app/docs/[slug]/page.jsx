import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import CodeTabs from "../../../components/CodeTabs";
import CopyPageButton from "../../../components/CopyPageButton";
import { getAllDocs, getDoc, getDocSlugs } from "../../../lib/docs";

/** A ```python fence immediately followed by a ```js fence renders as ONE tabbed block
 *  (the raw .md twins and llms.txt keep both fences in sequence — nothing agent-facing
 *  changes). Split the markdown into plain segments and python/js pairs. */
const PAIR = /(```python\n[\s\S]*?\n```)[ \t]*\n+[ \t]*(```(?:js|javascript)\n[\s\S]*?\n```)/g;

function splitPairs(raw) {
  const md = raw.replace(/\r\n/g, "\n"); // content files may be CRLF on Windows
  const parts = [];
  let last = 0;
  for (const m of md.matchAll(PAIR)) {
    if (m.index > last) parts.push({ md: md.slice(last, m.index) });
    parts.push({ python: m[1], js: m[2] });
    last = m.index + m[0].length;
  }
  if (last < md.length) parts.push({ md: md.slice(last) });
  return parts;
}

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

function load(slug) {
  try {
    return getDoc(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = load(slug);
  if (!doc) return {};
  return { title: `${doc.title} — GSAB Docs`, description: doc.summary };
}

export default async function DocPage({ params }) {
  const { slug } = await params;
  const doc = load(slug);
  if (!doc) notFound();

  const all = getAllDocs();
  const idx = all.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <div className="docpage__top">
        <span className="eyebrow">Docs · v0.10.0</span>
        <CopyPageButton slug={doc.slug} title={doc.title} markdown={doc.content} />
      </div>

      <div className="doc-md">
        {splitPairs(doc.content).map((part, i) =>
          part.md !== undefined ? (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
            >
              {part.md}
            </ReactMarkdown>
          ) : (
            <CodeTabs
              key={i}
              tabs={[{ label: "Python" }, { label: "JavaScript" }]}
              panels={[
                <ReactMarkdown
                  key="py"
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                >
                  {part.python}
                </ReactMarkdown>,
                <ReactMarkdown
                  key="js"
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                >
                  {part.js}
                </ReactMarkdown>,
              ]}
            />
          ),
        )}
      </div>

      <nav className="docpage__pager">
        {prev ? (
          <a href={`/docs/${prev.slug}`} className="docpage__prev">
            ← {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={`/docs/${next.slug}`} className="docpage__next">
            {next.title} →
          </a>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
