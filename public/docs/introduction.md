# Using GSAB

GSAB is a Python library and CLI that treats a Google Spreadsheet like a database: a tab is a table, a `Schema` gives it types and validation, and async methods give you CRUD. It also offers server-side queries (the Google Visualization query language), field encryption, a pandas bridge, and native in-sheet charts.

Sign in once with `gsab auth login` — no Google Cloud project required.

## Quickstart

```python
import asyncio
from gsab import SheetConnection, SheetManager, Schema, Field, FieldType

schema = Schema("users", [
    Field("id",   FieldType.INTEGER, required=True, unique=True),
    Field("name", FieldType.STRING,  required=True, max_length=80),
    Field("plan", FieldType.STRING,  default="free"),
    Field("price", FieldType.FLOAT),
])

async def main():
    db = SheetManager(SheetConnection(), schema)
    await db.create_sheet("My App DB")                 # creates the spreadsheet
    await db.insert({"id": 1, "name": "Ada", "plan": "pro", "price": 9.5})
    rows = await db.read({"plan": "pro"})              # Python-side filter
    hits = await db.query("SELECT A, D WHERE E > 5")   # server-side query
    print(rows, hits)

asyncio.run(main())
```

Start with [Install](/docs/install) and [Authentication](/docs/authentication), then define a [Schema](/docs/schemas) and read/write your sheet.
