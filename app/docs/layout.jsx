import DocsNav from "../../components/DocsNav";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { getAllDocs } from "../../lib/docs";

export default function DocsLayout({ children }) {
  const docs = getAllDocs().map(({ slug, title }) => ({ slug, title }));
  return (
    <>
      <SiteHeader />
      <main className="docs">
        <div className="wrap docs__grid">
          <aside className="docs__nav">
            <p className="docs__navhead">Documentation</p>
            <DocsNav docs={docs} />
          </aside>
          <article className="docs__body">{children}</article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
