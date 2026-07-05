---
title: JavaScript / TypeScript client
order: 12
summary: gsab-js on npm — no-auth browser reads, Node CRUD, a reactive cache, and a React hook.
---

# JavaScript / TypeScript client

`gsab-js` brings GSAB to the JS ecosystem — same ideas as the Python library (schemas,
validation, CRUD, server-side queries, realtime-style watch), shipped as one small package
that runs in the **browser and Node**. TypeScript types included.

```bash
npm install gsab-js
```

> Early (`0.1.x`) and moving fast. `watch()`, `createCache()` and `useSheet()` are
> **Experimental** — the API may change. See it running: [the live demo](/demo) is built on
> exactly what's below.

## Read a public sheet — no auth, no API key

Reading a sheet shared as "anyone with the link" works straight from a browser tab or a Node
script, with zero setup:

```js
import { connect } from "gsab-js";

const db = connect("https://docs.google.com/spreadsheets/d/<ID>/edit").sheet();

const rows = await db.read();                    // every row, typed by header
const pro  = await db.read({ plan: "pro" });     // client-side filters
const top  = await db.query("SELECT A, D ORDER BY D DESC LIMIT 10"); // server-side (gviz)

for await (const change of db.watch({ interval: 2000 })) {
  console.log(change); // { added, updated, removed } — includes edits made in the Sheet UI
}
```

## Reactive cache

One poller, one in-memory snapshot, granular events — many views can share it instead of each
re-reading the sheet:

```js
import { connect, createCache } from "gsab-js";

const cache = createCache(connect("<url>").sheet(), { key: "id", interval: 2000 });
cache.on("insert", (row) => console.log("added", row));
cache.on("update", (row, prev) => console.log("changed", prev, "→", row));
cache.on("delete", (row) => console.log("removed", row));
await cache.start();   // resolves once the initial snapshot loads
cache.all();           // current rows; also cache.get(key), cache.size, cache.running
```

## React

`useSheet` turns a sheet into live component state:

```jsx
import { connect } from "gsab-js";
import { useSheet } from "gsab-js/react";

const db = connect("<url>").sheet(); // module scope

function Users() {
  const { rows, loading, error } = useSheet(db, { key: "id" });
  if (loading) return <p>Loading…</p>;
  return <ul>{rows.map((r) => <li key={String(r.id)}>{String(r.name)}</li>)}</ul>;
}
```

Pass a shared `createCache(...)` instead of a manager and any number of components ride one
poller. React ≥18 is an optional peer dependency — the core entry never loads it.

## Writes (Node)

Writes need a Google sign-in. `loopbackAuth()` reuses the same sign-in as the Python CLI
(`gsab auth login`) — a browser opens once, the token is cached after:

```js
import { connect } from "gsab-js";
import { loopbackAuth } from "gsab-js/node";

const schema = {
  name: "users",
  fields: {
    id: { type: "integer", primaryKey: true },
    name: { type: "string", required: true },
    plan: { type: "string", default: "free" },
  },
};

const db = connect({ auth: await loopbackAuth() }).sheet(schema);
const id = await db.createSheet("My App DB");
await db.insert({ id: 1, name: "Ada", plan: "pro" });
await db.upsert({ id: 1, plan: "team" });
await db.update({ id: 1 }, { plan: "free" });   // writes ONLY the changed cells
await db.delete({ id: 1 });
const url = await db.share("reader");
```

Validation, primary keys, defaults and the `GSABError` hierarchy match the Python library, and
`update()`/`upsert()` are cell-targeted — concurrent edits to *different fields* of the same
row don't clobber each other.

## Deploying (Vercel / serverless / CI)

A server can't open a browser, so it uses a long-lived refresh token. Print your credentials
**once on your own machine** and set them as env vars:

```bash
node --input-type=module -e "console.log(await (await import('gsab-js/node')).deployEnv())"
# → { GSAB_CLIENT_ID, GSAB_CLIENT_SECRET, GSAB_REFRESH_TOKEN }   (secrets!)
```

```js
import { refreshTokenAuth } from "gsab-js/node";
const db = connect({ spreadsheetId, auth: refreshTokenAuth() }).sheet(schema);
```

The default scope is `drive.file` — the token can only touch sheets gsab created. This is
exactly how [the live demo](/demo) runs: public no-auth reads in the visitor's browser, and
`refreshTokenAuth()` writes inside Next.js route handlers.

## Browser sign-in

Direct in-browser Google sign-in (Google Identity Services) is **Planned** — today the
browser tier is read-only on public sheets, and writes go through your server as above.

## Links

- npm: [npmjs.com/package/gsab-js](https://www.npmjs.com/package/gsab-js)
- Source: [github.com/ajmalaksar25/gsab-js](https://github.com/ajmalaksar25/gsab-js)
- Live demo: [/demo](/demo)
