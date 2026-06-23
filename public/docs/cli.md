# CLI reference

```bash
gsab --help          # or: gsab help
gsab help auth       # help for a specific command

gsab version

gsab auth login   [--full] [--client-secrets PATH] [--no-browser]
gsab auth status  [--json]
gsab auth logout
```

- `gsab auth login` — browser sign-in; `--full` requests the broader scope, `-c/--client-secrets` uses your own OAuth client, `--no-browser` prints the URL instead of opening one.
- `gsab auth status` — shows which credential sources are available (`--json` for machine output).
- `gsab auth logout` — removes the cached token.
