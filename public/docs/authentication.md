# Authentication

**Easy mode (default).** One browser sign-in with the minimal, non-sensitive `drive.file` scope. GSAB can then create and manage the sheets it owns — no Google Cloud project required from your users.

```bash
gsab auth login
```

**DIY mode.** Reach your existing sheets, or bring your own OAuth client.

```bash
gsab auth login --full                   # access ALL your sheets (broader scope)
gsab auth login -c client_secret.json    # use your own OAuth client
```

Check or clear the cached token:

```bash
gsab auth status      # which credential sources are available
gsab auth logout      # remove the cached token
```

**Non-interactive.** The resolver auto-detects, in order: a cached login token → gcloud ADC → a service account. Point at a service account with an environment variable:

```bash
export GSAB_SERVICE_ACCOUNT=/path/to/service-account.json
# (GOOGLE_APPLICATION_CREDENTIALS is also honoured)
```

In code, credentials resolve automatically — or do it yourself:

```python
from gsab import resolve_credentials

creds = resolve_credentials()        # cached token / ADC / service account
```

Tokens are stored in your OS keychain (keyring), with a 0600-file fallback.

**macOS: stop the Keychain password prompt.** If every `gsab` command re-asks for your Keychain password, that's macOS prompting because the CLI binary isn't in the keychain item's ACL. Either click **"Always Allow"** when prompted, or skip the keychain entirely and use the token file:

```bash
export GSAB_NO_KEYRING=1   # store the token in a 0600 file instead of the Keychain
```

**Staying up to date.** The CLI prints a one-line notice (to stderr) when a newer `gsab` is on PyPI — checked at most once a day, cached, and never blocking. Silence it with `GSAB_NO_UPDATE_CHECK=1`.
