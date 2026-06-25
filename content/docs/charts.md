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
fig = px.bar(df, x="brand", y="price_eur")
fig.show()                        # interactive window
fig.write_html("chart.html")      # standalone HTML you can embed anywhere
```

See [live examples on the homepage](/#showcase) — interactive Plotly charts whose data round-trips through a real Google Sheet. For a full dashboard UI over a sheet, `gsab cookbook show dashboard` (Streamlit).
