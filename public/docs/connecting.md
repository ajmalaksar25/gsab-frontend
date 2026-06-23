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
