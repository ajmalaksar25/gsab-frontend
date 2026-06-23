# Defining a schema

A schema names the tab and declares its fields.

```python
from gsab import Schema, Field, FieldType

schema = Schema("users", [
    Field("id",     FieldType.INTEGER, required=True, unique=True),
    Field("name",   FieldType.STRING,  required=True, max_length=80),
    Field("email",  FieldType.STRING,  pattern=r"[^@]+@[^@]+\.[^@]+"),
    Field("age",    FieldType.INTEGER, min_value=0, max_value=150),
    Field("secret", FieldType.STRING,  encrypted=True),
])
```

**FieldType:** `STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`, `DATE`, `DATETIME`, `JSON`, `ENCRYPTED`. Values are converted and validated on write and coerced back on read (numbers as numbers, dates as `date`/`datetime`, etc.).

**Field options:** `required`, `unique`, `default`, `min_length` / `max_length`, `pattern`, `min_value` / `max_value`, `encrypted`, and custom `validation_rules` (each a `ValidationRule(condition, error_message)`). Validation runs on every write.
