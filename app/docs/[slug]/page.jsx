import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import CopyPageButton from "../../../components/CopyPageButton";
import { getAllDocs, getDoc, getDocSlugs } from "../../../lib/docs";

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
        <span className="eyebrow">Docs · v0.6.0</span>
        <CopyPageButton slug={doc.slug} title={doc.title} markdown={doc.content} />
      </div>

      <div className="doc-md">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        >
          {doc.content}
        </ReactMarkdown>
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
