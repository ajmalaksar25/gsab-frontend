"use client";

import { useEffect, useRef, useState } from "react";

const SITE = "https://gsab.ajmalaksar.com";

/** Split button: copy this page's Markdown, or open it in an LLM / as raw .md.
 *  Mirrors the familiar "Copy page" control on modern docs sites. */
export default function CopyPageButton({ slug, title, markdown }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const mdUrl = `${SITE}/docs/${slug}.md`;
  const prompt = `Read ${mdUrl} — the GSAB "${title}" documentation — and help me use it.`;

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
    setOpen(false);
  }

  return (
    <div className="copypage" ref={ref}>
      <button type="button" className="copypage__main" onClick={copy}>
        <span className="copypage__icon" aria-hidden="true">
          {copied ? "✓" : "⧉"}
        </span>
        {copied ? "Copied" : "Copy page"}
      </button>
      <button
        type="button"
        className="copypage__toggle"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ▾
      </button>
      {open && (
        <div className="copypage__menu" role="menu">
          <button type="button" role="menuitem" onClick={copy}>
            Copy page as Markdown
          </button>
          <a
            role="menuitem"
            href={`/docs/${slug}.md`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Open Markdown
          </a>
          <a
            role="menuitem"
            href={`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Ask ChatGPT
          </a>
          <a
            role="menuitem"
            href={`https://claude.ai/new?q=${encodeURIComponent(prompt)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Chat in Claude
          </a>
        </div>
      )}
    </div>
  );
}
