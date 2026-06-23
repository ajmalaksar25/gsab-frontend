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

For filter operators and server-side queries, see [Querying](/docs/querying).
