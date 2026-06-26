# MCP server

`gsab mcp` runs a [Model Context Protocol](https://modelcontextprotocol.io) server so an MCP host — Claude Desktop, Claude Code, or any MCP client — can use a Google Sheet as a database directly, with your existing GSAB sign-in.

```bash
pip install "gsab[mcp]"
gsab auth login          # one-time (or set GSAB_SERVICE_ACCOUNT for headless)
gsab mcp                 # runs the server over stdio
```

## Configure your host

Point your MCP host at the `gsab` command with the `mcp` argument. For Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "gsab": { "command": "gsab", "args": ["mcp"] }
  }
}
```

## Tools

| Tool | What it does |
|---|---|
| `create_sheet(title, columns, primary_key?)` | Create a sheet; returns its id + URL. A `primary_key` enables enforced uniqueness + `upsert`. |
| `columns(sheet_id)` | List the column names. |
| `insert(sheet_id, row)` | Add a row. |
| `read(sheet_id, filters?, limit?)` | Read rows; filter by `{col: value}` or `{col: {op: value}}`. |
| `update(sheet_id, filters, changes)` | Update matching rows. |
| `delete(sheet_id, filters)` | Delete matching rows. |
| `upsert(sheet_id, row, key?)` | Insert or update on the key (default: the primary key). |
| `query(sheet_id, sql)` | Server-side query (columns are letters: `SELECT A, B WHERE C = 'x'`). |
| `share(sheet_id)` | Make it public; returns the link + CSV URL. |

Columns are treated as text. The server reuses your GSAB credentials, so it only ever touches the sheets you've authorized (`drive.file` easy mode, or your DIY scope). Useful env vars: `GSAB_NO_KEYRING=1` (skip the macOS Keychain prompt), `GSAB_SERVICE_ACCOUNT` (headless auth).
