---
title: Schemas
order: 3
summary: Declare a tab's typed columns, validation rules, keys and uniqueness.
---

# Defining a schema

A schema names the tab and declares its fields.

```python
from gsab import Schema, Field, FieldType

schema = Schema("users", [
    Field("id",     FieldType.INTEGER, primary_key=True),
    Field("name",   FieldType.STRING,  required=True, max_length=80),
    Field("email",  FieldType.STRING,  pattern=r"[^@]+@[^@]+\.[^@]+"),
    Field("age",    FieldType.INTEGER, min_value=0, max_value=150),
    Field("plan",   FieldType.STRING,  default="free"),
    Field("secret", FieldType.STRING,  encrypted=True),
])
```

**FieldType:** `STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`, `DATE`, `DATETIME`, `JSON`. Values are converted and validated on write and coerced back on read (numbers as numbers, dates as `date`/`datetime`, etc.).

A **`JSON`** field stores a `dict` or `list` and round-trips it as a structured object — it's serialized to JSON on write and parsed back on read:

```python
schema = Schema("events", [
    Field("id", FieldType.INTEGER, primary_key=True),
    Field("meta", FieldType.JSON),
])
await db.insert({"id": 1, "meta": {"tags": ["a", "b"], "count": 3}})
(await db.read({"id": 1}))[0]["meta"]   # -> {"tags": ["a", "b"], "count": 3}  (a dict)
```

**Field options:** `required`, `unique`, `primary_key`, `default`, `min_length` / `max_length`, `pattern`, `min_value` / `max_value`, `encrypted`, and custom `validation_rules` (each a `ValidationRule(condition, error_message)`). Validation runs on every write.

## Keys & uniqueness

- **`primary_key=True`** marks a field as the table's key. It implies `required` + `unique`, and is the default key [`upsert()`](/docs/crud) matches on. A schema may have at most one.
- **`unique=True`** is enforced: inserting a value that already exists (or repeats within a `bulk_insert`) raises `DuplicateKeyError`. The check is a read-check-write — see the concurrency note in [CRUD](/docs/crud).

## Required vs. optional

A field is required by default. **Giving a field a `default` makes it optional** — if you omit it on insert, the default is written. So `Field("plan", FieldType.STRING, default="free")` never needs to be supplied.
