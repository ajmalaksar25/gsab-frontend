---
title: Charts
order: 7
summary: Embed native Google charts in the sheet, or plot with matplotlib/Plotly via to_dataframe().
---

# Charts

`chart()` embeds a native Google chart in the spreadsheet — no extra dependencies. For Python-side plots, hand `to_dataframe()` to matplotlib or Plotly.

```python
chart_id = await db.chart(x="brand", y="price_eur", kind="COLUMN", title="Price by brand")
chart_id = await db.chart(x="month", y=["revenue", "cost"], kind="LINE")
```

`kind`: `COLUMN`, `BAR`, `LINE`, `AREA`, `SCATTER`, `COMBO`, `STEPPED_AREA`, `PIE`. `y` may be a single field or a list. Returns the new chart's id.

```python
import plotly.express as px

df = await db.to_dataframe()
px.bar(df, x="brand", y="price_eur").show()
```
