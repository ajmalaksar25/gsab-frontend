---
title: MCP server
order: 10.5
summary: Use your Google Sheet as a database from any MCP client — Claude, Codex, Cursor, Zed and more.
---

# MCP server

`gsab mcp` runs a [Model Context Protocol](https://modelcontextprotocol.io) server so **any MCP client** can use a Google Sheet as a database directly, with your existing GSAB sign-in. MCP is an open standard — GSAB works the same with Claude (Desktop/Code), Codex, Cursor, Zed, Cline, OpenCode, Continue, and anything else that speaks MCP.

```bash
pip install "gsab[mcp]"
gsab auth login          # one-time (or set GSAB_SERVICE_ACCOUNT for headless)
gsab mcp                 # runs the server over stdio
```

## Configure your client

Every MCP client needs the same thing — a stdio server launched with **command `gsab`, args `["mcp"]`**. The config format differs per client; most use a JSON block like this:

```json
{
  "mcpServers": {
    "gsab": { "command": "gsab", "args": ["mcp"] }
  }
}
```

- **Claude Desktop** → `claude_desktop_config.json` (the block above).
- **Claude Code** → `claude mcp add gsab -- gsab mcp`.
- **Codex / Cursor / Zed / Cline / Continue / OpenCode** → add a stdio MCP server with the same `command` + `args` in that client's MCP settings.

If `gsab` isn't on the client's PATH, use the absolute path to the `gsab` executable (e.g. from your venv) as `command`.

## Tools

| Tool | What it does |
|---|---|
| `create_sheet(title, columns, primary_key?)` | Create a sheet; returns its id + URL. A `primary_key` enables enforced uniqueness + `upsert`. |
| `columns(sheet_id)` | List the column names. |
| `insert(sheet_id, row)` | Add a row. |
| `read(sheet_id, filters?, limit?)` | Read rows; filter by `{col: value}` or `{col: {op: value}}`. |
| `update(sheet_id, filters, changes)` | Update matching rows. |
| `delete(sheet_id, filters)` | Delete matching rows (**destructive** — permanent). |
| `upsert(sheet_id, row, key?)` | Insert or update on the key (default: the primary key). |
| `query(sheet_id, sql)` | Server-side query (columns are letters: `SELECT A, B WHERE C = 'x'`). |
| `share(sheet_id, role?)` | Make it public (`reader`/`commenter`/`writer`); returns the link + CSV URL. |

Columns are treated as text. The server reuses your GSAB credentials, so it only ever touches the sheets you've authorized (`drive.file` easy mode, or your DIY scope). Useful env vars: `GSAB_NO_KEYRING=1` (skip the macOS Keychain prompt), `GSAB_SERVICE_ACCOUNT` (headless auth).

## Access control

Run the server under an [`AccessPolicy`](/docs/access-control) to bound what an agent can do — safe defaults, control as flags, not env-var soup:

```bash
gsab mcp --read-only                 # only the read / query tools (no writes, deletes, sharing)
gsab mcp --policy team-policy.json   # allowed sheets, share-role cap, destructive-confirm
```

With `allowed_sheets` set, the server refuses any sheet outside the list **before it makes a network call**. The `delete` tool is labeled destructive and returns a clear "permanent, cannot be undone" warning.
