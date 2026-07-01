---
title: Access control
order: 10.7
summary: AccessPolicy — guardrails for what the library, the MCP server, the TUI, or an AI agent may do.
---

# Access control

An `AccessPolicy` is a small set of **guardrails** you construct in Python and pass where you use GSAB — to a `SheetManager`, or to the MCP server. Save it as a small JSON profile to share the same config across the library, the MCP server and the TUI.

> **What it is, honestly.** `AccessPolicy` is a *client-side guardrail* for safety, control and visibility — **not** the security boundary. The real boundary stays your OAuth **scope** (`drive.file` = only the sheets GSAB created). A determined caller of the raw library can ignore the policy; Google still enforces the real permissions.

```python
from gsab import AccessPolicy, SheetConnection, SheetManager

policy = AccessPolicy(
    read_only=False,            # block every write / delete / share
    allowed_sheets=None,        # None = any the credential can reach; or ["<id>", ...]
    allow_share=True,           # permit public sharing at all
    default_share_role="reader",
    max_share_role="writer",    # cap; "reader" forbids public-edit
    confirm_destructive=False,  # require confirm=True on delete
    on_activity=print,          # one event per op — the feed a UI renders
)

db = SheetManager(SheetConnection(), schema, policy=policy)
```

## What it controls

| Field | Effect |
|---|---|
| `read_only` | Blocks every mutation (create, insert, update, upsert, delete, share). |
| `allowed_sheets` | An optional id allowlist **on top of** the `drive.file` scope floor. `None` = no extra restriction. A sheet GSAB *created* in this manager is always allowed. |
| `allow_share` | Whether `share()` may make a sheet public at all. |
| `default_share_role` / `max_share_role` | The role `share()` uses by default, and the highest it may grant. Set `max_share_role="reader"` to forbid public-edit. |
| `confirm_destructive` | Requires `confirm=True` on `delete()`. |
| `on_activity` | A callback fired with an event dict after each op — the activity feed. Never breaks an operation. |

A blocked action raises **`PolicyError`** (part of the `gsab` error hierarchy).

## Share it as a profile

```python
policy.save("team-policy.json")            # JSON; the on_activity hook isn't stored
policy = AccessPolicy.load("team-policy.json")
```

## In the MCP server

The same profile guards an MCP agent — see [MCP server](/docs/mcp):

```bash
gsab mcp --read-only                 # only the read / query tools
gsab mcp --policy team-policy.json   # allowed sheets, share-role cap, destructive-confirm
```

With an allowlist, the server refuses to touch a sheet outside it **before any network call**.

## In the TUI *(Experimental)*

`gsab tui` opens a terminal cockpit over the same `AccessPolicy` — the sibling front-end to the MCP server, over the same core. Install the extra and launch it, optionally pointing at a profile:

```bash
pip install "gsab[tui]"
gsab tui                       # start from a permissive policy
gsab tui --policy team-policy.json   # open (and save back to) a profile
```

You get three panes:

- **Policy editor** — toggle `read_only` / `allow_share` / `confirm_destructive`, pick the default + max share role, and manage the allowed-sheets allowlist.
- **Probe** — pick an op (read, query, insert, upsert, update, delete, share, create) and a sheet id, and see whether it would be **allowed or blocked** — running the exact guardrail checks the library and MCP server apply.
- **Live activity feed** — the policy's `on_activity` events stream here as ops run. The policy on screen is a real `AccessPolicy`, so a `SheetManager` sharing it streams into the feed too.

Save from the TUI and the JSON profile is the same one `gsab mcp --policy` reads — one profile, three surfaces. *(Experimental — the API may still change; the TUI ships in the `gsab[tui]` extra.)*
