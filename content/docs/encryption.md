---
title: Field encryption
order: 8
summary: Seal sensitive fields with Fernet before they reach the sheet.
---

# Field encryption

Fields flagged `encrypted=True` are sealed with Fernet before they reach the sheet and decrypted on read. Pass an `encryption_key` to the manager.

```python
from cryptography.fernet import Fernet

key = Fernet.generate_key().decode()   # store this safely, e.g. in an env var

db = SheetManager(conn, schema, encryption_key=key)
```

Without a key, encrypted fields are written as-is — so keep the key out of source control and stable across runs, or you won't be able to decrypt old rows.
