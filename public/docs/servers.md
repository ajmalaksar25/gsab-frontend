# Servers & CI

For headless environments, use a service account. Create one in Google Cloud, download its key, and **share the target spreadsheet with the service account's email** so it can edit.

```bash
export GSAB_SERVICE_ACCOUNT=/path/to/service-account.json
python your_app.py     # SheetConnection() picks it up automatically
```

`GOOGLE_APPLICATION_CREDENTIALS` is also honoured, so GSAB works out of the box wherever Google application-default credentials are already configured.
