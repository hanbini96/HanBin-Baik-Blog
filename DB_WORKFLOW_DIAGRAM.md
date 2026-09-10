# 🗺️ DB WORKFLOW PROCESS & MIGRATION FILES RELATION TO SUPABASE

## Visual Workflow Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            DEVELOPMENT WORKFLOW                               │
└───────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌───────────────────────────────────────────────────────────────────────────────┐
│                        SQL MIGRATION FILES (Git)                              │
│                                                                               │
│  supabase/migrations/                                                        │
│  ├── 00_init_extensions_and_schema.sql  ┌───────────────────────────────────┐ │
│  ├── 00_rls_and_policies.sql            │ Initialize database extensions  │ │
│  ├── 00_views_functions_triggers.sql    │ Create schema, tables, indexes  │ │
│  ├── 01_create_migration_user.sql       │ Enable Row-Level Security       │ │
│  ├── 02_cleanup_existing_articles.sql   │ Create service account          │ │
│  └── 03_rls_migration_exceptions.sql   │ Preserve existing data          │ │
│                                                                               │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────────────────┐
│                        GITHUB REPOSITORY (Version Control)                    │
│                                                                               │
│  .github/workflows/db.yml                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Workflow: "Supabase DB Migrations"                                      │ │
│  │ Trigger: push to main branch, paths: supabase/migrations/**            │ │
│  │ Jobs:                                                                   │ │
│  │   1. deploy-staging (auto)                                              │ │
│  │      - Checkout code                                                    │ │
│  │      - Set up Node.js/pnpm                                              │ │
│  │      - Install Supabase CLI (with DNS retry logic)                      │ │
│  │      - Replace placeholders (secrets)                                   │ │
│  │      - Link Supabase CLI to project                                     │
│  │      - Push migrations to STAGING (supabase db push)                    │ │
│  │      - Validate post-migration                                          │ │
│  │                                                                         │ │
│  │   2. deploy-prod (manual approval)                                      │ │
│  │      - Same steps as staging                                            │ │
│  │      - Requires manual approval via GitHub Environment                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────────────────┐
│                        GITHUB ACTIONS RUNNER (CI/CD)                         │
│                                                                               │
│  Runner IP: 192.30.252.x / 185.199.108.x / 140.82.112.x / 143.55.64.x       │
│                                                                               │
│  Steps Executed:                                                             │
│  1. ✅ Checkout code from GitHub                                            │
│  2. ✅ Install Node.js and pnpm                                              │
│  3. ✅ Install Supabase CLI (with retries for DNS issues)                    │
│  4. ✅ Replace placeholders in SQL files:                                    │
│     - PLACEHOLDER_PASSWORD → MIGRATION_USER_PASSWORD secret                 │
│     - PLACEHOLDER_UUID → MIGRATION_USER_UUID secret                         │
│  5. ✅ Link Supabase CLI to project using SUPABASE_PROJECT_REF secret        │
│  6. ✅ Execute: supabase db push --db-url $STAGING_DB_URL                    │
│  7. ✅ Validate: Database connection, RLS policies, data integrity          │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE PLATFORM                                  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Project: hanbin-baik-blog                                                │
│  │                                                                         │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │ │
│  │  │  Database       │    │  Authentication │    │  Row-Level Security │  │ │
│  │  │  Engine         │    │  Service        │    │  Policies           │  │ │
│  │  │  (PostgreSQL)   │    │  Accounts       │    │                     │  │ │
│  │  └────────┬────────┘    └────────┬────────┘    └──────────┬────────────┘  │ │
│  │           │                      │                        │              │ │
│  │  ┌────────▼────────┐    ┌───────▼───────┐          ┌───────▼────────┐    │ │
│  │  │  Network        │    │  migration_   │          │  RLS Policies  │    │ │
│  │  │  Restrictions   │    │  user         │          │  for           │    │ │
│  │  │  (IP Allowlist) │    │  (Service     │          │  migration_    │    │ │
│  │  │  192.30.252.x   │    │  Account)     │          │  user          │    │ │
│  │  │  185.199.108.x  │    │               │          │                 │    │ │
│  │  │  140.82.112.x   │    │  Permissions: │          │  - posts        │    │ │
│  │  │  143.55.64.x    │    │  - SELECT      │◄─────────┤  - comments     │    │ │
│  │  └────────┬────────┘    │  - INSERT      │          │  - users        │    │ │
│  │           │             │  - UPDATE      │          └────────┬────────┘    │ │
│  └───────────┼─────────────┘  - DELETE      │                   │              │ │
│              │                - USAGE       │                   │              │ │
│              │                on sequences  │                   │              │ │
│              │                             │                   │              │ │
│              ▼                             ▼                   ▼              │ │
│        ┌─────────────────┐         ┌─────────────────┐         ┌────────────┐  │ │
│        │  GitHub Actions │         │  Database       │         │  Audit     │  │ │
│        │  IP Addresses   │         │  Connection     │         │  Logs      │  │ │
│        │  (Allowed)      │         │  String         │         │            │  │ │
│        └─────────────────┘         └─────────────────┘         └────────────┘  │ │
│                                                                               │ │
└───────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌───────────────────────────────────────────────────────────────────────────────┐
│                        MIGRATION EXECUTION FLOW                               │
└───────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────┐
│ Step-by-Step Execution:                                                      │
└───────────────────────────────────────────────────────────────────────────────┘

1. DEVELOPER COMMITS MIGRATION FILES
   ├─ Creates/modifies SQL files in supabase/migrations/
   ├─ Example: 02_cleanup_existing_articles.sql
   └─ Git commit: git add supabase/migrations/ && git commit -m "Add article cleanup"

2. GITHUB ACTIONS TRIGGERED
   ├─ Event: push to main branch
   ├─ Path filter: changes in supabase/migrations/**
   └─ Workflow: .github/workflows/db.yml

3. GITHUB ACTIONS RUNNER EXECUTES
   ├─ Runner IP: 192.30.252.x (added to Supabase allowlist)
   ├─ Step 1: Checkout code from GitHub repository
   ├─ Step 2: Install Node.js and pnpm dependencies
   ├─ Step 3: Install Supabase CLI (with DNS retry logic)
   │  ├─ Retry 3 times on DNS failure
   │  ├─ Fallback to direct binary download if needed
   │  └─ Verify installation with: supabase --version
   │
   ├─ Step 4: Replace placeholders in SQL files
   │  ├─ Find all .sql files in supabase/migrations/
   │  ├─ Replace: PLACEHOLDER_PASSWORD → ${MIGRATION_USER_PASSWORD}
   │  └─ Replace: PLACEHOLDER_UUID → ${MIGRATION_USER_UUID}
   │
   ├─ Step 5: Link Supabase CLI to project
   │  ├─ Command: supabase link --project-ref ${SUPABASE_PROJECT_REF}
   │  └─ Verify: CLI linked successfully
   │
   └─ Step 6: Push migrations to database
      ├─ Command: supabase db push --db-url ${STAGING_DB_URL}
      │  ├─ Supabase CLI reads all .sql files in order (00_*.sql, 01_*.sql, etc.)
      │  ├─ Executes SQL statements in transaction
      │  └─ Commits if all succeed, rolls back on any error
      │
      ├─ Validation after push:
      │  ├─ Database connection still works
      │  ├─ Migration user can access tables
      │  ├─ Articles preserved (no data loss)
      │  └─ RLS policies intact
      │
      └─ Duration: Typically 5-30 seconds for all migrations

4. SUPABASE PROCESSES MIGRATION
   ├─ Receives migration from GitHub Actions
   ├─ Validates SQL syntax
   ├─ Executes in PostgreSQL transaction
   ├─ Creates/updates database objects:
   │  ├─ Tables, indexes, constraints
   │  ├─ Functions, triggers, views
   │  ├─ RLS policies
   │  └─ Roles and permissions
   └─ Commits transaction on success

5. RESULT: MIGRATION COMPLETE
   ├─ Database schema updated
   ├─ GitHub Actions workflow shows "success"
   ├─ Migration files remain in Git for version control
   └─ Next deployment will only apply new migrations

┌───────────────────────────────────────────────────────────────────────────────┐
│ File Execution Order (Alphabetical/Numerical):                               │
└───────────────────────────────────────────────────────────────────────────────┘

supabase/migrations/
├── 00_init_extensions_and_schema.sql      (Extensions, schema, tables)
├── 00_rls_and_policies.sql                (Initial RLS setup)
├── 00_views_functions_triggers.sql        (Views, functions, triggers)
├── 01_create_migration_user.sql           (Service account creation)
├── 02_cleanup_existing_articles.sql       (Data preservation)
└── 03_rls_migration_exceptions.sql       (Additional RLS policies)

Note: Files are executed in alphabetical/numerical order (00_* before 01_*)

┌───────────────────────────────────────────────────────────────────────────────┐
│ Security Layers (Defense in Depth):                                          │
└───────────────────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ GitHub Actions runner IPs allowlisted in Supabase
├─ Only approved IPs can connect to database
└─ Prevents unauthorized network access

Layer 2: Authentication
├─ Dedicated service account: migration_user
├─ Limited permissions (SELECT, INSERT, UPDATE, DELETE, USAGE)
├─ No SUPERUSER role
└─ Password stored in GitHub secrets (encrypted at rest)

Layer 3: Authorization (RLS)
├─ Row-Level Security policies enabled on all tables
├─ migration_user has explicit access policies
└─ Prevents lateral movement even if credentials compromised

Layer 4: Secret Management
├─ GitHub Actions secrets (encrypted)
├─ No passwords in code or files
├─ Regular rotation schedule (90 days)
└─ Limited to repository admins

Layer 5: Monitoring & Auditing
├─ Database connection logs
├─ Failed login attempts tracked
├─ Query execution monitoring
└─ Alerts for unusual activity

┌───────────────────────────────────────────────────────────────────────────────┐
│ Database Objects Created by Migrations:                                      │
└───────────────────────────────────────────────────────────────────────────────┘

From 00_init_extensions_and_schema.sql:
├─ Extensions: pgcrypto, pg_trgm, uuid-ossp
├─ Tables: users, posts, comments
├─ Indexes: users_display_name_idx, posts_author_idx, posts_published_idx
│           posts_slug_trgm_idx, comments_post_idx
└─ Constraints: Primary keys, foreign keys, unique constraints

From 00_rls_and_policies.sql:
├─ RLS policies for initial security setup
└─ (Content reviewed separately)

From 00_views_functions_triggers.sql:
├─ Views, functions, triggers for application features
└─ (Content reviewed separately)

From 01_create_migration_user.sql:
├─ Role: migration_user (LOGIN, NOSUPERUSER)
├─ Permissions: USAGE on schema, CRUD on tables, USAGE on sequences
└─ User record: migration@hanbinbaik.com in public.users table

From 02_cleanup_existing_articles.sql:
├─ Data preservation logic
├─ Ensures published_at is set
└─ Verifies article count

From 03_rls_migration_exceptions.sql:
├─ RLS policies for migration_user:
│  ├─ migration_user_read_all (posts table)
│  ├─ migration_user_write_all (posts table)
│  └─ migration_user_comments_all (comments table)
└─ Allows migration_user to bypass RLS restrictions

┌───────────────────────────────────────────────────────────────────────────────┐
│ GitHub Secrets Required:                                                     │
└───────────────────────────────────────────────────────────────────────────────┘

Secrets (all stored in GitHub Actions secrets):
├─ SUPABASE_PROJECT_REF: Project reference for Supabase CLI linking
├─ SUPABASE_ACCESS_TOKEN: Access token for Supabase API
├─ MIGRATION_USER_PASSWORD: Password for migration_user service account
├─ MIGRATION_USER_UUID: UUID for migration_user in public.users table
├─ STAGING_DB_URL: Database connection string for staging
│  Format: postgresql://migration_user:password@db.***.supabase.co:5432/postgres?sslmode=require
└─ PROD_DB_URL: Database connection string for production
   Format: postgresql://migration_user:password@db.***.supabase.co:5432/postgres?sslmode=require

Note: All secrets are encrypted at rest in GitHub

┌───────────────────────────────────────────────────────────────────────────────┐
│ Validation & Testing Points:                                                 │
└───────────────────────────────────────────────────────────────────────────────┘

1. PRE-MIGRATION VALIDATION (in db.yml workflow)
   ├─ Check all required secrets exist
   ├─ Verify database connection works
   ├─ Check migration user role exists
   ├─ Verify migration user record in users table
   └─ Validate RLS policies count

2. POST-MIGRATION VALIDATION (in db.yml workflow)
   ├─ Check database connection still works
   ├─ Verify migration user can access posts table
   ├─ Check article preservation (no data loss)
   └─ Validate RLS policies still intact

3. MANUAL TESTING (scripts/test-migration-user.sh)
   ├─ Test 1: Migration user in public.users
   ├─ Test 2: Role exists in pg_roles
   ├─ Test 3: RLS policies count
   ├─ Test 4: Migration user can read posts
   └─ Test 5: Articles preserved

4. AUTOMATED MONITORING (Supabase dashboard)
   ├─ Active connections from migration_user
   ├─ Failed login attempts
   ├─ Query execution patterns
   └─ Unusual connection times/volumes

┌───────────────────────────────────────────────────────────────────────────────┐
│ Common Issues & Troubleshooting:                                             │
└───────────────────────────────────────────────────────────────────────────────┘

Issue 1: Network Connection Failed (ECONNREFUSED)
├─ Cause: GitHub Actions IP not in Supabase allowlist
├─ Solution: Add IP ranges to Supabase Network Restrictions
│  192.30.252.0/22, 185.199.108.133, 140.82.112.0/20, 143.55.64.0/20
└─ Verify: psql "$STAGING_DB_URL" -c "SELECT 1"

Issue 2: supabase: command not found
├─ Cause: CLI installation failed (DNS issues)
├─ Solution: Workflow has retry logic and fallback to direct download
└─ Verify: supabase --version

Issue 3: Permission denied for role postgres
├─ Cause: Using postgres user with network restrictions
├─ Solution: Use migration_user service account instead
└─ Verify: Connection string uses migration_user

Issue 4: Migration files not applied
├─ Cause: Files not in correct order or naming
├─ Solution: Name files 00_*.sql, 01_*.sql, etc. (alphabetical order)
└─ Verify: ls -la supabase/migrations/ | grep .sql

Issue 5: Data loss during migration
├─ Cause: Migration modifies existing data incorrectly
├─ Solution: Use 02_cleanup_existing_articles.sql for preservation
└─ Verify: ./scripts/test-migration-user.sh (Test 5)

┌───────────────────────────────────────────────────────────────────────────────┐
│ Best Practices:                                                              │
└───────────────────────────────────────────────────────────────────────────────┘

✅ DO:
├─ Name migration files with leading numbers (00_, 01_, 02_)
├─ Keep migrations idempotent (can run multiple times safely)
├─ Test migrations locally before committing
├─ Use the test script: ./scripts/test-migration-user.sh
├─ Monitor workflow runs regularly
├─ Rotate secrets every 90 days
├─ Document all database changes in migrations
└─ Use transactions in complex migrations

❌ DON'T:
├─ Don't use postgres user for CI/CD (security risk)
├─ Don't commit passwords to files
├─ Don't modify migrations after they're committed (create new ones)
├─ Don't run migrations manually without testing
└─ Don't disable RLS without understanding implications

┌───────────────────────────────────────────────────────────────────────────────┐
│ Related Files & Documentation:                                               │
└───────────────────────────────────────────────────────────────────────────────┘

Project Files:
├─ .github/workflows/db.yml              - CI/CD workflow definition
├─ supabase/migrations/*.sql              - SQL migration files
├─ scripts/test-migration-user.sh         - Validation script
├─ DB_MIGRATION_FIX_PLAN.md              - This comprehensive plan
└─ DB_WORKFLOW_DIAGRAM.md                - Visual workflow documentation

External Resources:
├─ Supabase Documentation: https://supabase.com/docs
├─ PostgreSQL Docs: https://www.postgresql.org/docs/
├─ GitHub Actions Docs: https://docs.github.com/actions
└─ Row-Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

---

## 📊 Summary

This diagram shows how your SQL migration files flow from Git → GitHub Actions → Supabase, with multiple security layers protecting your database. The workflow is fully automated but secure, following NYPL best practices for database management.

**Key Takeaways:**
1. Migration files are version-controlled in Git
2. GitHub Actions automates the execution
3. Supabase provides the database platform
4. Multiple security layers protect your data
5. Everything is auditable and reversible

---

*Last Updated: 2026-09-04  
Version: 1.0  
Status: ✅ COMPLETE*
