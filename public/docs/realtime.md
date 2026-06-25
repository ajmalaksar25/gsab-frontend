# Realtime — `watch()`

> **Experimental.** Google Sheets has no change-stream, so `watch()` **polls and diffs** (~1–2s) — it is not push. See the [use-case envelope](#when-to-use-it) below.

`watch()` turns a sheet into a live source. It's an async generator that polls the tab, diffs against the last snapshot, and yields change sets — detecting writes from **anyone**: this library, another connection, or a person editing in the Google Sheets UI.

```python
async for change in db.watch(interval=2.0):
    # change = {"added": [...], "updated": [...], "removed": [...]}  (rows keyed on the primary key)
    apply(change)
```

`watch(*, interval=2.0, filters=None, key=None, emit_initial=True)` — `interval` is the poll cadence (seconds); `filters` watches a subset (same as `read()`); `key` is the diff key (defaults to the primary key); `emit_initial` yields the current rows once before watching.

## Drive many viewers — one poller, fan out

Don't make each browser poll Google (N× the rate cost). Run **one** `watch()` loop on the server and broadcast its events to every client over Server-Sent Events or a WebSocket. Five viewers cost one poll loop — comfortably under the rate limit.

```python
# FastAPI — one watcher, broadcast to all SSE clients. Full recipe:
#   gsab cookbook show realtime_api
async def poller():
    async for change in db.watch(interval=2.0):
        for q in subscribers:           # one queue per connected browser
            q.put_nowait(change)
```

A runnable side-by-side demo (the real sheet on the left, a `watch()`-driven table on the right) lives in `examples/realtime-demo/` in the repo — `python server.py`, then edit the sheet and watch the app update.

## When to use it

A clear envelope — and inside it, no compromise:

**Great fit:** live dashboards · internal tools & admin panels · small-team collaborative apps (a few edit, others watch) · forms / submission feeds · config or content a non-dev edits in the Sheet · prototypes and MVPs. Read-heavy, human-speed writes.

**Wrong tool:** high-frequency writes (chat, games, IoT/financial ticks) · strict transactions or oversold-inventory protection · sub-second SLAs · very large or hot, high-QPS tables · many writers hammering the same rows.

GSAB gives a Convex-*feel* for that envelope — a sheet that updates live for everyone watching — not a database replacement. It's honest polling, clearly labeled.
