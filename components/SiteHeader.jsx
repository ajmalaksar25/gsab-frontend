import { GITHUB, PYPI } from "../lib/links";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-head">
      <div className="wrap site-head__inner">
        <a className="brand" href="/">
          <span className="brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          GSAB
        </a>
        <nav className="site-nav">
          <a href="/docs">Docs</a>
          <a className="hide-sm" href="/#features">Features</a>
          <a className="hide-sm" href="/#start">Quickstart</a>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="nav-cta" href={PYPI} target="_blank" rel="noreferrer">
            PyPI ↗
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
