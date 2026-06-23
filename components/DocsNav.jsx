"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Sidebar nav for the docs; highlights the current page. */
export default function DocsNav({ docs }) {
  const pathname = usePathname();
  return (
    <nav>
      {docs.map((d) => {
        const href = `/docs/${d.slug}`;
        const active = pathname === href;
        return (
          <Link key={d.slug} href={href} className={active ? "is-active" : ""}>
            {d.title}
          </Link>
        );
      })}
    </nav>
  );
}
