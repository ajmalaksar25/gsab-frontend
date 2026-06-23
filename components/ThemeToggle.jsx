"use client";

/** Toggles light/dark on <html data-theme>. Label flips via CSS (no hydration mismatch). */
export default function ThemeToggle() {
  function toggle() {
    const el = document.documentElement;
    const next = el.dataset.theme === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try {
      localStorage.setItem("gsab-theme", next);
    } catch (e) {
      /* storage unavailable — no-op */
    }
  }

  return (
    <button className="themetoggle" type="button" onClick={toggle} aria-label="Toggle dark mode">
      <span className="t-dark">Dark</span>
      <span className="t-light">Light</span>
    </button>
  );
}
