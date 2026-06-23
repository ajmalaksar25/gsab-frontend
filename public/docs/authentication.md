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
