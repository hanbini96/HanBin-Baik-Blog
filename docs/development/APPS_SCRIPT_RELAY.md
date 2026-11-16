# Inquiry emails: Apps Script Gmail relay

When someone submits `/hire`, the `submit-inquiry` Edge Function saves the row,
then POSTs it to an Apps Script web app that sends two emails from your Gmail:

- **Alert to you** (`NOTIFY_EMAIL`), reply-to = the submitter
- **Confirmation to them**, reply-to = you

Optionally, it logs each inquiry to a Google Sheet.

```
/hire → submit-inquiry (Supabase) ──HTTPS + secret──▶ Apps Script web app ──▶ Gmail (MailApp)
                                                                          └─▶ Google Sheet (optional)
```

**Why not SMTP or Resend:** Supabase Edge Functions can't open SMTP ports 25/587.
Apps Script sends from your Gmail with no DNS setup and no extra vendor. The free
Gmail quota is 100 recipients/day (2 per inquiry). Emails are best-effort: a relay
failure is logged but the inquiry is still saved.

## Keys and where they live

| Name | Where | Value |
| --- | --- | --- |
| `RELAY_SECRET` | Apps Script → Project Settings → Script properties | Long random string (see below) |
| `NOTIFY_EMAIL` | Script properties | Your inbox |
| `SENDER_NAME` | Script properties (optional) | Display name, default `HanBin Marrero-Baik` |
| `LEAD_SHEET_ID` | Script properties (optional) | Spreadsheet ID for a lead log |
| `GMAIL_RELAY_SECRET` | GitHub Actions secret | **Same value** as `RELAY_SECRET` |
| `GMAIL_RELAY_URL` | GitHub Actions secret | Web app URL ending in `/exec` |
| `CLASPRC_JSON` | GitHub Actions secret | Contents of your `~/.clasprc.json` after `clasp login` |
| `APPS_SCRIPT_ID` | GitHub Actions secret | Script ID (Project Settings → IDs) |
| `APPS_SCRIPT_DEPLOYMENT_ID` | GitHub Actions secret | Web app deployment ID (`AKfy…`) |

`db.yml` copies `GMAIL_RELAY_URL` and `GMAIL_RELAY_SECRET` into Supabase function
secrets on deploy. Script properties stay in Google and are never in the repo.

Generate the shared secret:

```bash
openssl rand -hex 32
```

## One-time setup (local, ~15 min)

1. **Enable the Apps Script API** for your Google account:
   https://script.google.com/home/usersettings → toggle on.
2. **Install clasp and log in:**
   ```bash
   npm install -g @google/clasp@3.4.1
   clasp login            # browser opens; approve
   cat ~/.clasprc.json    # → GitHub secret CLASPRC_JSON (whole file)
   ```
3. **Create the script project** from the repo:
   ```bash
   cd apps-script/inquiry-relay
   clasp create-script --type standalone --title "hanbinbaik.dev inquiry relay" --rootDir .
   clasp push --force
   ```
   `.clasp.json` now holds the script ID, which is your `APPS_SCRIPT_ID`. Don't commit it; it's gitignored.
4. **Script properties:** `clasp open-script` → Project Settings → Script
   properties → add `RELAY_SECRET` and `NOTIFY_EMAIL` (plus optional ones).
5. **First deployment + authorization** (in the editor):
   - Select `doGet` → **Run** once → approve the "send email as you" and Sheets
     permissions. This is the one consent screen.
   - **Deploy → New deployment → Web app**. Set Execute as **Me** and Who has access **Anyone**.
   - Copy the **Web app URL** (`…/exec`) → `GMAIL_RELAY_URL`, and the
     **Deployment ID** → `APPS_SCRIPT_DEPLOYMENT_ID`.
6. **Add the GitHub secrets** in the table above.
7. **Merge.** Then:
   - `apps-script.yml` pushes the code and updates that same deployment, so the URL never changes.
   - `db.yml` syncs the relay URL/secret into Supabase and redeploys `submit-inquiry`.

## Test

- `curl <GMAIL_RELAY_URL>` → `{"ok":true,"remainingQuota":…}`
- Submit `/hire` → alert in your inbox, confirmation in the submitter's, and both in Gmail Sent.
- No email? Check Supabase → Edge Functions → `submit-inquiry` logs for
  `gmail relay failed`, and Apps Script → Executions for errors.
  `unauthorized` means `RELAY_SECRET` ≠ `GMAIL_RELAY_SECRET`.

## Notes

- If `clasp` CI starts failing with an auth error, your refresh token was
  revoked or expired. Run `clasp login` again and update `CLASPRC_JSON`.
- Adding a new OAuth scope to `appsscript.json` needs one manual re-run in the
  editor to approve it; CI can't click consent screens.
