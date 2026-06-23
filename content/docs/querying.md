---
title: Querying
order: 6
summary: Rich read() filters, plus server-side query() in the Google Visualization query language.
---

# Querying

`read()` filters support these operators: `$eq $ne $gt $gte $lt $lte $in $nin $contains $regex`.

```python
await db.read({"age": {"$gte": 18}})
await db.read({"plan": {"$in": ["pro", "team"]}})
await db.read({"email": {"$contains": "@"}})
```

For server-side power — filtering, sorting and aggregation that run on Google's side, not in Python — use `query()` with the Google Visualization query language. Columns are referenced by letter; `column()` maps a field name to its letter.

```python
rows = await db.query("SELECT A, D WHERE D = 'pro' ORDER BY A DESC LIMIT 10")
db.column("plan")   # -> "D"
```

`query()` returns dicts keyed by the sheet's header labels. Columns that map to a schema field come back in that field's Python type (and decrypted), matching `read()`; aggregates like `SUM(D)` stay gviz-native.

> Server-side filtering on `DATE` columns isn't supported yet — filter dates in Python via `read()`.

## pandas bridge

```python
await db.from_dataframe(df)            # insert every row in bulk; returns count
out = await db.to_dataframe()          # read into a DataFrame
out = await db.to_dataframe({"plan": "pro"})
```

Requires `pip install "gsab[pandas]"`.
