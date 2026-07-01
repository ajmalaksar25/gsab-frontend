---
title: CRUD
order: 5
summary: Async create, read, update, delete — plus bulk insert and upsert.
---

# CRUD

A `SheetManager` binds a connection to a schema and gives you async create / read / update / delete.

```python
from gsab import SheetManager

db = SheetManager(conn, schema)
sheet_id = await db.create_sheet("My App DB")   # creates the spreadsheet, returns its id

await db.insert({"id": 101, "name": "Ada", "email": "ada@calc.org"})
await db.bulk_insert([{...}, {...}])            # many rows in one append; returns count

# read everything, or filter:
rows = await db.read()
rows = await db.read({"plan": "pro"})               # equality
rows = await db.read({"name": {"$regex": "Ada"}})   # operator

await db.update({"id": 101}, {"plan": "team"})      # returns rows changed
await db.delete({"plan": "free"})                   # returns rows deleted

await db.rename_sheet("New title")
await db.delete_sheet()                             # remove the whole spreadsheet
```

`read()` returns a list of dicts keyed by field name, with values in their schema types (no internal bookkeeping fields leak out). `update()` and `delete()` return how many rows matched; `delete()` uses each row's true sheet index, so duplicate rows are handled correctly.

## Upsert — idempotent insert-or-update

If your schema has a [primary key](/docs/schemas), `upsert()` inserts a row, or updates the existing one with the same key. Fields you omit keep their current value. It's the idempotent write you want for syncing or "create if missing" flows.

```python
schema = Schema("users", [
    Field("id", FieldType.INTEGER, primary_key=True),   # the key upsert matches on
    Field("name", FieldType.STRING),
    Field("plan", FieldType.STRING, default="free"),
])
db = SheetManager(conn, schema)

await db.insert({"id": 1, "name": "Ada", "plan": "pro"})
await db.upsert({"id": 1, "plan": "free"})    # -> "updated"  (name "Ada" is kept)
await db.upsert({"id": 2, "name": "Lin"})     # -> "inserted"

# Batch — one append + one batched update; last entry wins per key:
await db.bulk_upsert([{"id": 1, "plan": "pro"}, {"id": 3, "name": "Eve"}])
# -> {"inserted": 1, "updated": 1}
```

`upsert()` returns `"inserted"` or `"updated"`; `bulk_upsert()` returns `{"inserted": n, "updated": m}`. Both default to the schema's primary key — pass `key="field"` to match on another column instead.

A `primary_key` / `unique` field is **enforced**: a plain `insert()` of a key that already exists raises `DuplicateKeyError`. Use `upsert()` when you want insert-or-update instead.

> **Heads-up — no conditional write.** Enforcement and upsert are a *read-check-write*: GSAB reads the tab, then writes. Google Sheets has no atomic conditional write, so two clients upserting the *same new key* at the same moment can both insert. Concurrent updates are last-write-wins. For single-client or low-contention use this is exactly what you want; for strict cross-client uniqueness, serialize the writes.

## Publish a sheet (public link)

Turn a sheet you created into a read-only public link with one call — handy for sharing data, embedding, or pointing a dashboard at it. This stays on the default `drive.file` scope because GSAB owns the sheets it creates.

```python
url = await db.share()        # anyone with the link can view; returns the URL
db.csv_url                    # CSV-export URL — pandas.read_csv(db.csv_url) once shared
await db.unshare()            # revoke public access
```

`share(role=...)` takes `reader` (default), `commenter` or `writer` — `writer` lets anyone with the link edit, so use it with care (the Sheets UI term *editor* is an alias). An [`AccessPolicy`](/docs/access-control) can cap how high the role may go. Sharing only works for sheets **GSAB created**, not a user's pre-existing sheets; revocation is immediate at the permission level, though Google's public export cache can lag for a short while.

For filter operators and server-side queries, see [Querying](/docs/querying).
