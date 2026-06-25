import { EMAIL, GITHUB, ISSUES, PYPI, SITE } from "../lib/links";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot__inner">
        <div className="foot__brand">
          GSAB
          <span>Google Sheets as a Backend</span>
        </div>
        <nav className="foot__links">
          <a href="/docs">Docs</a>
          <a href={PYPI} target="_blank" rel="noreferrer">
            PyPI
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="/#start">Quickstart</a>
          <a href="/#roadmap">Roadmap</a>
          <a href={ISSUES} target="_blank" rel="noreferrer">
            Feedback
          </a>
          <a href={`mailto:${EMAIL}`}>Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <div className="foot__by">
          Built by{" "}
          <a href={SITE} target="_blank" rel="noreferrer">
            Ajmal Aksar
          </a>
        </div>
      </div>
    </footer>
  );
}
