# Supabase CI/CD (single project, free tier)

`.github/workflows/db.yml` handles all database and Edge Function changes.

| Trigger | Job | Touches production? | Secrets |
| --- | --- | --- | --- |
| Pull request (`supabase/**`) | `validate`: local Postgres on the runner, applies every migration, lints | No | None |
| Push to `main` (`supabase/**`) | `validate` → `deploy` | Yes (`production` environment) | Yes |
| Manual run | same as push, optional one-time baseline repair | Yes | Yes |

PRs from forks can't read secrets on a public repo. The PR job needs none, so it
works for everyone and can never write to production.

## Required repo secrets

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token (Supabase → Account → Access Tokens) |
| `SUPABASE_PROJECT_REF` | Project ref (the `<ref>` in `<ref>.supabase.co`) |
| `PROD_DB_URL` | **Session pooler** string from Supabase → Connect → Session pooler, port **5432**, password URL-encoded: `postgresql://postgres.<ref>:<password>@aws-<n>-<region>.pooler.supabase.com:5432/postgres` |
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret (synced to Edge Function secrets on deploy) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TURNSTILE_SITE_KEY` | Public values used by the Pages build |

`STAGING_DB_URL` is no longer used and can be deleted.

Why the pooler: `db.<ref>.supabase.co` is IPv6-only unless you buy the IPv4
add-on, and GitHub-hosted runners only have IPv4. The shared pooler is IPv4 on
every plan.

## Supabase settings

- **Network Restrictions:** allow all IPv4 (or disable). GitHub runner IPs change
  every run. Restrictions only cover direct Postgres/pooler connections; the
  REST API and Edge Functions are public by design and protected by RLS.
- **Database password:** long and random; it only lives in `PROD_DB_URL`.
- **Never** store the `service_role` key in GitHub. Edge Functions get it from
  Supabase automatically.

## Migrations

- File names: `<YYYYMMDDHHMMSS>_<name>.sql`. The CLI uses the numeric prefix as
  the version, so every file needs a unique, increasing timestamp.
- Create new ones with `supabase migration new <name>`.
- The baseline schema was renamed from `00_*.sql` to `20250101000000…02`. Those
  objects already exist in production, so record them once (below) instead of
  re-running them.

## One-time cutover

1. Supabase: Network Restrictions → allow all IPv4.
2. GitHub secrets: set `PROD_DB_URL` to the Session pooler string; delete
   `STAGING_DB_URL`.
3. Merge this workflow PR.
4. Actions → **Supabase DB** → Run workflow on `main` with
   **repair_baseline** checked. This marks the three baseline migrations as
   applied, then runs `db push` (nothing new to apply yet).
5. Merge feature PRs. Each merge to `main` applies new migrations and deploys
   functions automatically.

If production has an approval rule on the `production` environment, approve the
`deploy` job when it pauses.

## Keep-alive

Free projects pause after about a week without activity. The Pages workflow
rebuilds on a schedule, and each build reads posts from Supabase, which keeps the
project awake. Don't remove that schedule unless something else hits the API.
