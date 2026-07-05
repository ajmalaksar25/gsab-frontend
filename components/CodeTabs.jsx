"use client";

// Python ⇄ JavaScript switcher for code samples. The chosen language is remembered
// (localStorage) and every CodeTabs on the site follows it, so a reader who picks
// JavaScript once reads the whole docs in JavaScript.
import { useEffect, useState } from "react";

const KEY = "gsab-lang";
const EVT = "gsab-lang-change";

export default function CodeTabs({ tabs, panels, chrome = false }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const apply = () => {
      const pref = window.localStorage.getItem(KEY);
      const i = tabs.findIndex((t) => t.label === pref);
      if (i >= 0) setIdx(i);
    };
    apply();
    window.addEventListener(EVT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(EVT, apply);
      window.removeEventListener("storage", apply);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i) => {
    setIdx(i);
    window.localStorage.setItem(KEY, tabs[i].label);
    window.dispatchEvent(new Event(EVT));
  };

  const buttons = tabs.map((t, i) => (
    <button
      key={t.label}
      type="button"
      className={`lang-tab${i === idx ? " is-active" : ""}`}
      onClick={() => pick(i)}
    >
      {t.label}
    </button>
  ));

  if (chrome) {
    return (
      <div className="editor editor--wide demo-editor">
        <div className="editor__bar">
          <i />
          <i />
          <i />
          <span className="editor__file">{tabs[idx].file}</span>
          <span className="lang-tabs__bar lang-tabs__bar--chrome">{buttons}</span>
        </div>
        {panels.map((p, i) => (
          <div key={tabs[i].label} hidden={i !== idx}>
            {p}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lang-tabs">
      <div className="lang-tabs__bar">{buttons}</div>
      {panels.map((p, i) => (
        <div key={tabs[i].label} hidden={i !== idx}>
          {p}
        </div>
      ))}
    </div>
  );
}
