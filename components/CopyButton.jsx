"use client";

import { useState } from "react";

/** A copyable command pill. Shows "copied" feedback briefly. */
export default function CopyButton({ text, prompt = "$" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <button type="button" className="cmd" onClick={copy} aria-label="Copy command">
      <span className="cmd__prompt" aria-hidden="true">
        {prompt}
      </span>
      <code className="cmd__text">{text}</code>
      <span className={`cmd__state ${copied ? "is-copied" : ""}`}>{copied ? "copied" : "copy"}</span>
    </button>
  );
}
