# Astro + Supabase Blog Starter

Welcome to your **Astro + Supabase blog starter**! This repository contains a minimal yet scalable template for creating a content‑driven site with Astro, Tailwind CSS, React islands, and Supabase as the data source.  It is designed to be hosted on **GitHub Pages** with CI/CD powered by GitHub Actions.

## 🎯 Features

- **Astro v5** configured for a static build (`output: 'static'`) and optimized for GitHub Pages.
- **React islands architecture**—only interactive components (like the blog list and login widget) are hydrated on the client.
- **Tailwind CSS** integrated via `@astrojs/tailwind` and ready for custom styling.
- **Supabase client** initialized in `src/lib/supabase.ts` with environment variables for URL and anon key.
- **Simple email magic‑link authentication** (`AuthPanel.tsx`) for admin login.
- **Blog** page with dynamic routes (`src/pages/blog/[slug].astro`) and client‑side data fetching via Supabase.
- **GitHub Actions workflow** to automatically build and deploy the site to GitHub Pages.
- **Template‐ready**: you can mark this repo as a template in GitHub settings and use it for future projects.

## 🧑‍💻 Getting Started

1. **Clone or import the repository.**  Click the **“Use this template”** button on GitHub after you mark it as a template, or manually clone the repo.
2. **Rename `.env.example` to `.env`** and fill in your Supabase credentials:

   ```bash
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_ANON_KEY=<your-anon-key>
   ```

   Supabase credentials are safe to publish; they’re public environment variables used for client‑side access.

3. **Install dependencies** (requires Node 18+ and `pnpm` or `npm`):

   ```bash
   pnpm install
   pnpm run dev
   ```

   The site runs locally at http://localhost:4321.

4. **Customize `astro.config.mjs`.** Set `site` to your GitHub Pages URL and `base` to your repository name if using a `<username>.github.io/<repo>` sub‑directory.  When deploying to a custom domain, remove `base` and update `site` accordingly.

5. **Push to GitHub.**  The included workflow file `.github/workflows/deploy.yml` will build and deploy your site automatically using the official Astro GitHub Action.  Add your Supabase credentials as repository secrets (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) if you prefer not to commit them.

6. **(Optional) Configure a custom domain.**  Add your domain to `public/CNAME`, update `site` in `astro.config.mjs`, and point your DNS records to GitHub Pages.

## 🧱 Supabase Setup

Create a Supabase table named `posts` in the SQL editor:

```sql
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id),
  title text not null,
  slug text unique not null,
  content text not null,
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Enable [**row‑level security** (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security) and add policies so published posts are readable by anyone while drafts are only visible to their authors:

```sql
alter table posts enable row level security;

create policy "read_published" on posts
  for select using (published = true);

create policy "author_select" on posts
  for select using (auth.uid() = author_id);

create policy "author_insert" on posts
  for insert with check (auth.uid() = author_id);

create policy "author_update" on posts
  for update using (auth.uid() = author_id);

create policy "author_delete" on posts
  for delete using (auth.uid() = author_id);
```

Once these policies are in place, your blog can safely read and write posts from the browser without exposing unpublished drafts to everyone.

## 🏗️ Extending This Starter

- **Add Markdown rendering.** Store Markdown in `content` and render it using MDX or a parser of your choice.
- **Create admin UI.** Add routes under `src/pages/admin` with React components to edit and publish posts.
- **Use Supabase Storage.** Upload images or videos to Supabase Storage buckets and reference them in your posts.
- **Analytics and SEO.** Integrate Umami or Plausible for analytics and set meta tags in `Base.astro` for better SEO.

## 📊 Monitoring & Analytics Setup

### 🏥 Infrastructure Monitoring & Health Checks

The project includes comprehensive infrastructure monitoring with health check endpoints:

**Health Check Endpoints:**
- **Basic Health**: `/api/health` - Simple health status
- **Comprehensive Health**: `/api/health.json` - Detailed health with Supabase connectivity
- **Methods**: GET, POST, HEAD
- **Cache**: Disabled for real-time monitoring

**Features:**
- ✅ Supabase database connectivity verification
- ✅ System resource monitoring (memory, uptime)
- ✅ GitHub Actions automated health checks
- ✅ Uptime tracking and alerting
- ✅ Performance metrics collection

**Setup:**
```bash
# Test health endpoints locally
pnpm run dev
curl http://localhost:4321/api/health.json
```

### 🏆 Recommended: Plausible Analytics
For personal blogs, **Plausible Analytics** is the best choice:
- ✅ Free for < 10k pageviews/month
- ✅ Privacy-focused (no cookie consent needed)
- ✅ Lightweight (< 1ms performance impact)
- ✅ Simple 5-minute setup
- ✅ Beautiful, easy-to-understand dashboard

**Setup:** https://plausible.io/docs

### 📋 Alternative Options
- **Umami Analytics**: Free self-hosted alternative (https://umami.is)
- **Google Analytics 4**: Comprehensive but requires cookie consent
- **Sentry**: ❌ **NOT recommended** for personal blogs (overkill, expensive)

See **[SENTRY_VS_ALTERNATIVES.md](SENTRY_VS_ALTERNATIVES.md)** for detailed comparison.

## 📊 Stabilization & Observability

This project includes a comprehensive stabilization and observability initiative to improve website reliability, performance, and monitoring. See the following resources:

### 📋 Issues & Tracking
- **[GitHub Issues Dashboard](https://github.com/hanbini96/HanBin-Baik-Blog/issues)** - All stabilization issues assigned to hanbini96
- **[Stabilization Implementation Guide](STABILIZATION_IMPLEMENTATION_GUIDE.md)** - Complete roadmap and implementation guide

### 📊 Documentation Files
- **[STABILIZATION_PLAN.md](STABILIZATION_PLAN.md)** - Overall plan and strategy for stabilization
- **[BENCHMARKS.md](BENCHMARKS.md)** - Performance and stability benchmarks with historical tracking
- **[OBSERVABILITY_SETUP.md](OBSERVABILITY_SETUP.md)** - Detailed guide for setting up monitoring and observability

### 🚀 Working Branches
All stabilization work is organized into feature branches:
- `feature/error-tracking-lightweight` - Lightweight error tracking with React Error Boundaries
- `feature/performance-monitoring` - Performance monitoring and benchmarking
- `feature/real-user-monitoring` - Real user monitoring with Plausible Analytics
- `feature/infrastructure-monitoring` - Infrastructure health checks
- `feature/benchmark-documentation` - Benchmark documentation system
- `feature/advanced-observability` - Advanced monitoring features
- `feature/alerting-system` - Alerting and incident response

### 🎯 Current Issues (Assigned to hanbini96)
- **[#4 - Error Tracking with Sentry](https://github.com/hanbini96/HanBin-Baik-Blog/issues/4)** - High Priority
- **[#5 - Performance Monitoring & Benchmarking](https://github.com/hanbini96/HanBin-Baik-Blog/issues/5)** - High Priority  
- **[#6 - Real User Monitoring with Plausible](https://github.com/hanbini96/HanBin-Baik-Blog/issues/6)** - Medium Priority
- **[#7 - Infrastructure Monitoring & Health Checks](https://github.com/hanbini96/HanBin-Baik-Blog/issues/7)** - High Priority
- **[#8 - Benchmark Documentation System](https://github.com/hanbini96/HanBin-Baik-Blog/issues/8)** - Medium Priority
- **[#9 - Advanced Observability Features](https://github.com/hanbini96/HanBin-Baik-Blog/issues/9)** - Low Priority
- **[#10 - Alerting System & Incident Response](https://github.com/hanbini96/HanBin-Baik-Blog/issues/10)** - Medium Priority
