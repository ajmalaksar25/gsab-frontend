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

## How heavy can the filtering get?

`query()` exposes the full **Google Visualization query language** — close to SQL, run on Google's servers:

- **`WHERE`** with `AND` / `OR` / `NOT`, the comparisons `= != < <= > >=`, `IS NULL` / `IS NOT NULL`, and the text matchers `CONTAINS`, `STARTS WITH`, `ENDS WITH`, `MATCHES` (regex), `LIKE`.
- **`GROUP BY`** with the aggregates `SUM AVG COUNT MAX MIN`, plus **`PIVOT`**.
- **`ORDER BY ... ASC|DESC`**, **`LIMIT`**, **`OFFSET`**, and `LABEL` / `FORMAT`.

```python
await db.query(
    "SELECT D, COUNT(A) WHERE C > 100 AND (B CONTAINS 'pro' OR B STARTS WITH 't') "
    "GROUP BY D ORDER BY COUNT(A) DESC LIMIT 5"
)
```

So for read-heavy analytics — dashboards, leaderboards, reports — push the work into `query()` and let Google do it. Two honest limits: there are **no SQL joins** (Sheets has no relations — join in Python across sheets), and `query()` runs against one tab.

**`read()` vs `query()`:** `read()` fetches the rows and filters in **Python**, so its operators (`$in`, `$regex`, `$contains`, …) are convenient but it pulls the whole tab first — fine for small/medium sheets. `query()` filters/sorts/aggregates **server-side** and returns only what matched — use it when the sheet is large or the filtering is heavy.

> Server-side filtering on `DATE` columns isn't supported yet — filter dates in Python via `read()`.

## pandas bridge

```python
await db.from_dataframe(df)            # insert every row in bulk; returns count
out = await db.to_dataframe()          # read into a DataFrame
out = await db.to_dataframe({"plan": "pro"})
```

Requires `pip install "gsab[pandas]"`.
