# 🚀 HanBin-Baik-Blog Template

**A production-ready blog template built with Astro, Supabase, and GitHub Pages**

This template powers [hanbinbaik.dev](https://hanbinbaik.dev) and is designed to be easily customizable for your own blog. It includes professional-grade features like performance monitoring, CI/CD automation, and database integration.

---

## ✨ Quick Start (5 Minutes)

### Option 1: Use GitHub Template (Recommended)

1. Click the **"Use this template"** button on GitHub
2. Select **"Create a new repository"**
3. Name your repository (e.g., `my-blog`)
4. Clone your new repository:
   ```bash
   git clone https://github.com/your-username/my-blog.git
   cd my-blog
   ```

### Option 2: Manual Clone

```bash
# Clone the template
git clone https://github.com/hanbini96/HanBin-Baik-Blog.git my-blog
cd my-blog

# Remove existing git history (start fresh)
rm -rf .git

# Initialize new git repository
git init
git add .
git commit -m "Initial commit: HanBin-Baik-Blog template"

# Create new GitHub repository and push
gh repo create my-blog --public --push --source=.
```

---

## 📦 Install Dependencies

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

---

## 🔧 Basic Configuration

### 1. Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Required variables:**
```env
# Site configuration
PUBLIC_SITE_URL=https://your-domain.com

# Supabase (optional - remove if not using database)
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Site Configuration

Edit `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://your-domain.com',  // ← Change this
  output: 'static',
  // ... rest of config
});
```

### 3. Custom Domain (Optional)

If using a custom domain with GitHub Pages:
```bash
# Add your domain to CNAME file
echo "your-domain.com" > public/CNAME
```

---

## 🏃 First Run

```bash
# Start development server
pnpm dev

# Open in browser
# Visit http://localhost:3000
```

---

## 🚀 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages:**
   - Go to: `Settings → Pages`
   - Source: `GitHub Actions`
   - Save

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - GitHub Actions will automatically:
     - Build your site
     - Run Lighthouse performance tests
     - Deploy to GitHub Pages
   - Usually completes in 2-5 minutes

4. **Access your site:**
   - `https://your-username.github.io/my-blog/`
   - Or your custom domain if configured

### Manual Deployment

```bash
# Build the site
pnpm build

# Deploy to GitHub Pages
npx gh-pages -d dist
```

---

## 🎯 Features Included

### ✅ Core Features
- **Astro 5.18.0** - Modern static site generator
- **React 18.2.0** - Component-based UI
- **Tailwind CSS** - Utility-first styling
- **Markdown Support** - Easy blog post creation
- **Syntax Highlighting** - Code blocks with Shiki

### ✅ Database & Backend
- **Supabase Integration** - PostgreSQL database
- **Edge Functions** - Serverless functions
- **Authentication** - User auth ready
- **Real-time Updates** - Live data sync

### ✅ Performance & SEO
- **Lighthouse Monitoring** - Automated performance tracking
- **SEO Optimized** - Meta tags, sitemaps
- **Fast Loading** - Static generation
- **Image Optimization** - Automatic optimization

### ✅ DevOps & Automation
- **GitHub Actions CI/CD** - Automated workflows
- **Performance Benchmarks** - Track improvements
- **Infrastructure Monitoring** - Health checks
- **Automated Deployments** - Push to deploy

### ✅ Security
- **CodeQL Scanning** - Security vulnerability detection
- **Branch Protection** - Main branch protection
- **Secret Management** - GitHub secrets integration
- **Bot Protection** - Cloudflare Turnstile ready

---

## 📊 Performance Scores

This template achieves:
- **Lighthouse Performance:** 87+/100
- **Lighthouse SEO:** 92+/100
- **Lighthouse Accessibility:** 94+/100
- **Lighthouse Best Practices:** 100/100

---

## 🔧 Customization

### Change Site Name & Description

Edit `src/layouts/Base.astro`:
```astro
<head>
  <title>Your Site Name | {title}</title>
  <meta name="description" content="Your site description">
</head>
```

### Change Theme

Edit `tailwind.config.cjs`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',  // Change to your brand color
        secondary: '#10b981',
      },
    },
  },
};
```

### Add Navigation Links

Edit `src/components/Nav.astro`:
```astro
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
  <!-- Add your links here -->
</nav>
```

---

## 📚 Documentation

- **[Full Setup Guide](SETUP_GUIDE.md)** - Detailed step-by-step instructions
- **[Architecture](ARCHITECTURE.md)** - Technical stack overview
- **[Customization](CUSTOMIZATION.md)** - Advanced customization options
- **[Deployment](DEPLOYMENT.md)** - Hosting options and configurations

---

## 🤝 Community & Support

- **Issues:** [GitHub Issues](https://github.com/hanbini96/HanBin-Baik-Blog/issues)
- **Discussions:** [GitHub Discussions](https://github.com/hanbini96/HanBin-Baik-Blog/discussions)
- **License:** [MIT License](LICENSE)
- **Original Site:** [hanbinbaik.dev](https://hanbinbaik.dev)

---

## 💡 Tips

1. **Start simple** - Use the default configuration first
2. **Customize gradually** - Change one thing at a time
3. **Test locally** - Always test before pushing
4. **Check workflows** - Monitor GitHub Actions for errors
5. **Update regularly** - Keep dependencies up to date

---

## 📝 Changelog

- **v1.0.0** (2026-11-18) - Initial template release

---

**Happy blogging! 🚀**

*Template by [HanBin Baik](https://github.com/hanbini96)*
*Powered by Astro, Supabase, and GitHub Pages*
