import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export function getDocSlugs() {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getDoc(slug) {
  const raw = fs.readFileSync(path.join(DOCS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    order: data.order ?? 999,
    summary: data.summary || "",
    content: content.trim(),
  };
}

export function getAllDocs() {
  return getDocSlugs()
    .map(getDoc)
    .sort((a, b) => a.order - b.order);
}
