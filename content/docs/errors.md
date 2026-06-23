---
title: Errors & exceptions
order: 9
summary: One exception hierarchy with clear, actionable messages for people and LLM agents.
---

# Errors & exceptions

Every GSAB exception subclasses `GSABError`, so you can catch one type and read a plain-language, actionable message.

```python
from gsab import GSABError, AuthError, NotFoundError, ValidationError

try:
    await db.query("SELECT bogus")
except ValidationError as e:
    ...        # bad query / record / argument (also a ValueError)
except AuthError as e:
    ...        # not signed in; message says: run `gsab auth login`
except GSABError as e:
    ...        # anything else GSAB-related
```

| Exception | Meaning / what to do |
|---|---|
| `AuthError` | Not authenticated, or the saved session expired/was revoked → run `gsab auth login`. |
| `ConnectionError` | Could not reach Google (network drop/timeout). Check your connection. |
| `NotFoundError` | The spreadsheet or tab does not exist. Check the id and tab name. |
| `PermissionDeniedError` | The account may not access the spreadsheet, or the scope wasn't granted. |
| `QuotaExceededError` | Rate limit / quota hit. GSAB retries 429/5xx with backoff; try again later. |
| `ValidationError` | A record, filter, argument or query was rejected (also a `ValueError`). |
| `APIError` | An unexpected Google Sheets API error. |

GSAB automatically retries transient failures (429, 5xx, dropped connections, timeouts) with exponential backoff before raising.
