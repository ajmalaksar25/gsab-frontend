---
title: CLI reference
order: 10
summary: The gsab command — auth and version, from your shell.
---

# CLI reference

```bash
gsab --help          # or: gsab help
gsab help auth       # help for a specific command

gsab version

gsab auth login   [--full] [--client-secrets PATH] [--no-browser]
gsab auth status  [--json]
gsab auth logout

gsab skill list
gsab skill install [--project] [--portable] [--path DIR]

gsab doctor [--live]
gsab init [PATH] [--fastapi]
gsab import <CSV> [--title TITLE]
gsab cookbook list
gsab cookbook show <name> [--out FILE]
```

## Get productive fast

```bash
gsab init my-app --fastapi   # scaffold schema.py, app.py, README + a FastAPI api.py
gsab doctor --live           # check setup + a real create/write/read/query/delete round-trip
gsab import data.csv         # infer a schema and load a CSV into a new sheet (pandas extra)
gsab cookbook show charts    # print a ready recipe (or write it with --out)
```

`gsab init` won't overwrite existing files. `gsab doctor --live` cleans up the throwaway sheet it makes.

- `gsab auth login` — browser sign-in; `--full` requests the broader scope, `-c/--client-secrets` uses your own OAuth client, `--no-browser` prints the URL instead of opening one.
- `gsab auth status` — shows which credential sources are available (`--json` for machine output).
- `gsab auth logout` — removes the cached token.

## Skills for your coding agent

`gsab skill install` drops GSAB skills where coding agents look for them, so Claude Code (and others) know the real GSAB API:

```bash
gsab skill install              # → ~/.claude/skills (all your projects)
gsab skill install --project    # → ./.claude/skills (this repo only)
gsab skill install --portable   # also writes GSAB_LLMS.md to paste into ChatGPT, Codex, Cursor or any LLM
```

It ships two skills: **`gsab`** (core usage, API reference, recipes) and **`gsab-fastapi`** (a working FastAPI-on-GSAB CRUD pattern). `gsab skill list` shows what's available.
