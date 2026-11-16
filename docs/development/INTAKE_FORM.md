# Project Intake Form (`/hire`) and Inbox (`/inbox`)

Tracks issue #146. Lets prospective clients submit freelance project requests and
lets the owner review and reply.

## Flow

```
/hire (IntakeForm.tsx)
  └─ supabase.functions.invoke('submit-inquiry')
       ├─ honeypot + min fill time  → silent 200, nothing stored
       ├─ Cloudflare Turnstile      → 400 captcha_failed
       ├─ field validation          → 400 invalid_fields
       └─ insert (service role)     → public.inquiries
                                         └─ Database Webhook → n8n (optional)
                                              HubSpot · Sheet · notify · auto-reply
/inbox (InquiryInbox.tsx, inside ProtectedLayout)
  └─ rpc is_owner() + select/update via RLS
```

The browser never writes to `public.inquiries`: the anon key is public, so any
anon insert policy would let bots bypass the captcha.

`signInWithOtp` lets anyone create an account, so `authenticated` is **not** the
owner. RLS checks `public.is_owner()`, which matches the JWT email against
`public.app_owners`.

## One-time setup

1. **Turnstile:** create a widget at Cloudflare → Turnstile for
   `hanbinbaik.dev` (and `www.hanbinbaik.dev`). Note the site key and secret key.
2. **GitHub secret:** add `TURNSTILE_SITE_KEY` (repo → Settings → Secrets → Actions).
   The Pages build exposes it as `PUBLIC_TURNSTILE_SITE_KEY`.
3. **Migration:** `supabase/migrations/20261116000000_inquiries.sql` is validated on
   the PR and applied to production on merge by `db.yml` (see `SUPABASE_CI.md`).
4. **Owner email** (SQL editor, each environment):
   ```sql
   insert into public.app_owners (email) values ('<your login email, lowercase>');
   ```
5. **Edge Function:** add repo secret `TURNSTILE_SECRET`. On merge, `db.yml`
   syncs it plus `ALLOWED_ORIGINS` into function secrets and deploys
   `submit-inquiry`. Keep the default JWT verification on; the form sends the anon key.
6. **Notifications (optional, recommended):** Supabase → Database → Webhooks →
   new webhook on `public.inquiries` INSERT → POST to your n8n webhook URL with a
   secret header. In n8n: verify header → HubSpot contact + deal → Google Sheet
   row → email/phone notification → auto-reply to the client.

## Local development

```bash
supabase start
supabase db reset                     # applies migrations
supabase functions serve submit-inquiry --env-file supabase/.env.local
# supabase/.env.local: TURNSTILE_DISABLED=true
#                      ALLOWED_ORIGINS=http://localhost:4321
pnpm dev                              # leave PUBLIC_TURNSTILE_SITE_KEY empty
```

## Verification checklist

- [ ] Valid submission → row in `inquiries`, success message shown
- [ ] Filled honeypot / instant submit → 200, no row
- [ ] Missing or bad captcha → 400 `captcha_failed`, no row
- [ ] REST `POST /rest/v1/inquiries` with anon key → denied
- [ ] REST `GET /rest/v1/inquiries` with anon key → empty / denied
- [ ] Non-owner magic-link login on `/inbox` → "not authorized", no rows
- [ ] Owner: status change, notes save, reply opens prefilled email and marks replied

## Changing options

Option values live in three places and must match:
`src/lib/inquiryOptions.ts`, the CHECK constraints in `20261116000000_inquiries.sql`, and the
arrays in `supabase/functions/submit-inquiry/index.ts`. Add a new migration that
alters the constraint when adding a value.
