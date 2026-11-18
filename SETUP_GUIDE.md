# 📋 Complete Setup Guide

**Step-by-step instructions to set up your blog using the HanBin-Baik-Blog template**

This guide walks you through every step from cloning the template to deploying your live blog.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Quick Setup](#-quick-setup)
3. [Detailed Configuration](#-detailed-configuration)
4. [Supabase Setup (Optional)](#-supabase-setup-optional)
5. [Content Creation](#-content-creation)
6. [Deployment](#-deployment)
7. [Post-Setup](#-post-setup)
8. [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

### Required Tools

| Tool | Version | Installation | Verify |
|------|---------|--------------|--------|
| **Node.js** | ≥24.0.0 | [Download Node.js](https://nodejs.org/) | `node --version` |
| **pnpm** | ≥11.0.0 | `npm install -g pnpm` | `pnpm --version` |
| **Git** | Latest | [Download Git](https://git-scm.com/) | `git --version` |
| **GitHub Account** | - | [Sign up](https://github.com/) | - |
| **Code Editor** | - | VS Code, etc. | - |

### Verify Installation

```bash
# Check all tools are installed
node --version  # Should be v24.0.0 or higher
pnpm --version  # Should be v11.0.0 or higher
git --version   # Should be v2.x or higher
```

---

## ⚡ Quick Setup

### 1. Create Repository from Template

**Method A: GitHub Web UI (Recommended)**
1. Go to: [HanBin-Baik-Blog Template](https://github.com/hanbini96/HanBin-Baik-Blog)
2. Click **"Use this template"** button
3. Select **"Create a new repository"**
4. Enter repository name: `my-blog` (or your preferred name)
5. Keep it **Public** (required for free GitHub Pages)
6. Click **"Create repository"**

**Method B: GitHub CLI**
```bash
# Create from template
gh repo create my-blog --template hanbini96/HanBin-Baik-Blog --public
cd my-blog
```

### 2. Clone and Install

```bash
# Clone your new repository
git clone https://github.com/your-username/my-blog.git
cd my-blog

# Install dependencies
pnpm install
```

### 3. Quick Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit basic configuration
nano .env  # Change PUBLIC_SITE_URL to your domain
```

### 4. Test Locally

```bash
# Start development server
pnpm dev

# Open in browser: http://localhost:3000
```

### 5. Deploy

```bash
# Commit and push
git add .
git commit -m "Initial setup"
git push origin main
```

Your site will be live at: `https://your-username.github.io/my-blog/`

---

## 🔍 Detailed Configuration

### Environment Variables

Edit `.env` file:

```env
# Required
PUBLIC_SITE_URL=https://your-username.github.io/my-blog

# Optional - Supabase (remove if not using database)
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - Analytics (if using)
PUBLIC_GA_ID=your-google-analytics-id

# Optional - Cloudflare Turnstile (for forms)
PUBLIC_TURNSTILE_SITE_KEY=your-site-key
```

### Site Configuration

Edit `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  // Your site URL
  site: 'https://your-username.github.io/my-blog/',
  
  // Static site output
  output: 'static',
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark'  // Change theme if desired
    }
  },
  
  // Integrations
  integrations: [
    react(),
    tailwind()
  ],
  
  // Vite configuration
  vite: {
    build: {
      rollupOptions: {
        onwarn: (warning, defaultHandler) => {
          if (warning.code === 'PLUGIN_WARNING' && warning.message.includes('marked()')) {
            return;
          }
          defaultHandler(warning);
        }
      }
    }
  }
});
```

### Custom Domain (Optional)

If you have a custom domain:

1. **Add to CNAME file:**
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure in GitHub:**
   - Go to: `Settings → Pages`
   - Enter your custom domain
   - Follow GitHub's verification steps

3. **Update site URL:**
   ```javascript
   // In astro.config.mjs
   site: 'https://your-domain.com',
   ```

---

## 🗃️ Supabase Setup (Optional)

If you want database functionality (comments, contact forms, etc.):

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up
2. Click **"New Project"**
3. Enter project name: `my-blog`
4. Select **Free tier**
5. Choose region (select closest to your audience)
6. Click **"Create Project"**

### 2. Get API Keys

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public key** (e.g., `eyJhbGciOi...`)

### 3. Configure Environment

Add to `.env`:
```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database

The template includes basic database schema in `supabase/migrations/`. To apply:

```bash
# Install Supabase CLI
pnpm add -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### 5. Configure Authentication (Optional)

If you want user authentication:

1. Go to **Authentication → Providers**
2. Enable desired providers (GitHub, Google, Email, etc.)
3. Configure callback URLs

---

## ✍️ Content Creation

### Create a Blog Post

1. **Create markdown file:**
   ```bash
   # In src/pages/blog/
   touch src/pages/blog/2026-11-18-my-first-post.md
   ```

2. **Add frontmatter:**
   ```markdown
   ---
   title: My First Blog Post
   description: This is my first blog post using the HanBin-Baik-Blog template
   date: 2026-11-18
   tags:
     - getting-started
     - template
   draft: false
   ---
   
   # My First Blog Post
   
   Welcome to my blog!
   
   This is my first post using the **HanBin-Baik-Blog** template.
   ```

3. **Add images:**
   - Place images in `public/images/`
   - Reference in markdown: `![Alt text](/images/my-image.jpg)`

### Create a Page

1. **Create Astro file:**
   ```bash
   touch src/pages/about.astro
   ```

2. **Add content:**
   ```astro
   ---
   // src/pages/about.astro
   const { title } = Astro.props;
   ---
   
   <html>
     <head>
       <title>{title} | My Blog</title>
     </head>
     <body>
       <h1>About Me</h1>
       <p>This is my about page.</p>
     </body>
   </html>
   ```

### Modify Layout

Edit `src/layouts/Base.astro` to change the global layout:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
}

const { title = 'My Blog' } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My personal blog">
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

## 🚀 Deployment

### GitHub Pages (Recommended)

#### Automatic Deployment

1. **Enable GitHub Pages:**
   - Go to: `Settings → Pages`
   - Source: `GitHub Actions`
   - Save

2. **Push to main:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Check **Actions** tab
   - Wait for workflows to complete (2-5 minutes)
   - Your site will be live at: `https://your-username.github.io/my-blog/`

#### Manual Deployment

```bash
# Build the site
pnpm build

# Deploy using gh-pages
npx gh-pages -d dist
```

### Other Hosting Options

#### Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site" → "Import an existing project"**
3. Connect to GitHub
4. Select your repository
5. Set build command: `pnpm build`
6. Set publish directory: `dist`
7. Click **"Deploy site"**

#### Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click **"Add New" → "Project"**
3. Import GitHub repository
4. Select framework: **Astro**
5. Click **"Deploy"**

#### Cloudflare Pages

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/)
2. Click **"Create project"**
3. Connect GitHub
4. Select repository
5. Set build command: `pnpm build`
6. Set build output directory: `dist`
7. Click **"Save and Deploy"**

---

## ✅ Post-Setup Checklist

- [ ] Repository created from template
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Site URL updated in `astro.config.mjs`
- [ ] Custom domain configured (if applicable)
- [ ] First blog post created
- [ ] Site tested locally (`pnpm dev`)
- [ ] GitHub Pages enabled
- [ ] First deployment successful
- [ ] Site accessible at your URL

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails

**Error:** `Build failed`

**Solution:**
```bash
# Check Node.js version
node --version  # Must be ≥24.0.0

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Try building again
pnpm build
```

#### 2. Dependencies Not Found

**Error:** `Cannot find module`

**Solution:**
```bash
# Install missing dependencies
pnpm install

# Or install specific package
pnpm add package-name
```

#### 3. GitHub Pages Not Deploying

**Error:** Site shows 404

**Solution:**
1. Check **Actions** tab for workflow errors
2. Ensure GitHub Pages is enabled
3. Verify `astro.config.mjs` has correct `site` URL
4. Check `public/CNAME` if using custom domain

#### 4. Supabase Connection Fails

**Error:** `Failed to connect to Supabase`

**Solution:**
1. Verify `.env` has correct Supabase URL and key
2. Check Supabase project is running
3. Ensure no typos in environment variables
4. Restart development server

#### 5. Styles Not Loading

**Error:** Plain HTML, no styling

**Solution:**
```bash
# Reinstall Tailwind
pnpm add -D @astrojs/tailwind tailwindcss

# Ensure Tailwind is in astro.config.mjs
import tailwind from '@astrojs/tailwind';
integrations: [tailwind()]
```

---

## 📚 Additional Resources

- **[Astro Documentation](https://docs.astro.build/)** - Official Astro docs
- **[Supabase Documentation](https://supabase.com/docs)** - Supabase guides
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Tailwind documentation
- **[GitHub Pages](https://pages.github.com/)** - GitHub Pages docs
- **[Original Template](https://github.com/hanbini96/HanBin-Baik-Blog)** - Source repository

---

## 💬 Get Help

If you encounter issues:

1. **Check this guide** - Most common issues are covered above
2. **Search GitHub Issues** - [Issues](https://github.com/hanbini96/HanBin-Baik-Blog/issues)
3. **Create a new issue** - Include error messages and steps to reproduce
4. **Join discussions** - [Discussions](https://github.com/hanbini96/HanBin-Baik-Blog/discussions)

---

**Happy blogging! 🚀**

*Need more help? Check out [ARCHITECTURE.md](ARCHITECTURE.md) for technical details or [CUSTOMIZATION.md](CUSTOMIZATION.md) for advanced customization.*
