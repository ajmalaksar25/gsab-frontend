# Connecting

`SheetConnection` resolves credentials and builds the API client. With no arguments it uses your cached login.

```python
from gsab import SheetConnection

conn = SheetConnection()                 # easy mode (cached login)
await conn.connect()

# servers / CI:
conn = SheetConnection(service_account_file="service-account.json")
```

A `SheetManager` (see [CRUD](/docs/crud)) binds this connection to a [schema](/docs/schemas) and connects lazily on first use, so calling `connect()` yourself is optional.

## Use an existing spreadsheet

Easy mode (`drive.file`) covers sheets GSAB created. To work with a spreadsheet you already have, set its id directly — and use **DIY auth** (`gsab auth login --full`, or your own OAuth client with `-c`) so the broader scope can reach it. See [Authentication](/docs/authentication).

```python
db = SheetManager(SheetConnection(), schema)
db.sheet_id = "1AbC...your-spreadsheet-id"   # the tab must match schema.name
rows = await db.read()
```
