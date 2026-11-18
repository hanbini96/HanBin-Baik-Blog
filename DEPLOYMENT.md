# 🚀 Deployment Guide

**Host your HanBin-Baik-Blog on various platforms**

This guide covers deployment options for your blog, from free GitHub Pages to professional hosting services.

---

## 📋 Table of Contents

1. [GitHub Pages (Recommended)](#-github-pages-recommended)
2. [Netlify](#-netlify)
3. [Vercel](#-vercel)
4. [Cloudflare Pages](#-cloudflare-pages)
5. [Self-Hosting](#-self-hosting)
6. [Custom Domain Setup](#-custom-domain-setup)
7. [Deployment Checklist](#-deployment-checklist)
8. [Troubleshooting](#-troubleshooting)

---

## 🏆 GitHub Pages (Recommended)

**Best for:** Personal blogs, portfolios, documentation sites  
**Cost:** Free  
**Ease:** ⭐⭐⭐⭐⭐  
**Features:** Automatic CI/CD, free SSL, custom domains

### Automatic Deployment (Recommended)

The template comes with GitHub Actions pre-configured for automatic deployment.

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

#### 2. Push to Main Branch

```bash
# Make your changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 3. Wait for Deployment

- GitHub Actions will automatically:
  - Run Lighthouse performance tests
  - Build your site
  - Deploy to GitHub Pages
- Deployment usually takes **2-5 minutes**
- Check the **Actions** tab to monitor progress

#### 4. Access Your Site

Your site will be available at:
```
https://your-username.github.io/your-repo/
```

### Manual Deployment

If you prefer manual control:

```bash
# Build the site
pnpm build

# Deploy using gh-pages
npx gh-pages -d dist
```

### GitHub Pages Configuration

The template includes a workflow file: `.github/workflows/github_pages.yml`

**Key features:**
- Automatic deployment on push to `main`
- Performance monitoring with Lighthouse
- Cache optimization for faster builds
- Error handling and notifications

---

## ☁️ Netlify

**Best for:** Professional sites, teams, advanced features  
**Cost:** Free tier available  
**Ease:** ⭐⭐⭐⭐⭐  
**Features:** CDN, form handling, serverless functions

### Step-by-Step Deployment

#### 1. Sign Up for Netlify

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Sign up with GitHub
3. Click **"Add new site"**

#### 2. Connect Repository

1. Click **"Import an existing project"**
2. Connect to GitHub
3. Select your repository
4. Click **"Deploy site"**

#### 3. Configure Build Settings

Netlify will auto-detect Astro, but verify:

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Publish directory | `dist` |
| Node version | `24` |

#### 4. Deploy

Click **"Deploy site"** and wait for completion (usually 1-2 minutes)

#### 5. Access Your Site

Your site will be available at:
```
https://your-site-name.netlify.app
```

### Advanced Configuration

#### Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add your variables:
   - `PUBLIC_SITE_URL` - Your production URL
   - `PUBLIC_SUPABASE_URL` - Your Supabase URL
   - `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase key

#### Redirects

Create `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### Form Handling

Netlify provides built-in form handling:

```astro
<form name="contact" method="POST" netlify>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

---

## ⚡ Vercel

**Best for:** Next.js/Astro projects, edge functions, performance  
**Cost:** Free tier available  
**Ease:** ⭐⭐⭐⭐⭐  
**Features:** Edge network, automatic CI/CD, preview deployments

### Step-by-Step Deployment

#### 1. Sign Up for Vercel

1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**

#### 2. Import Repository

1. Click **"Import Git Repository"**
2. Select your repository
3. Click **"Continue"**

#### 3. Configure Project

Vercel will auto-detect Astro:

| Setting | Value |
|---------|-------|
| Framework | Astro |
| Root directory | (leave empty) |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Install command | `pnpm install` |

#### 4. Deploy

Click **"Deploy"** and wait for completion

#### 5. Access Your Site

Your site will be available at:
```
https://your-project.vercel.app
```

### Advanced Configuration

#### Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add your variables

#### Preview Deployments

Vercel automatically creates preview deployments for PRs:
- Each PR gets its own URL
- Great for testing before merging

#### Edge Functions

Create `src/functions/hello.ts`:

```typescript
import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Edge Function!' }),
  };
};
```

#### Custom Domains

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow verification steps

---

## 🌐 Cloudflare Pages

**Best for:** Performance, security, global CDN  
**Cost:** Free  
**Ease:** ⭐⭐⭐⭐⭐  
**Features:** Global CDN, automatic HTTPS, DDoS protection

### Step-by-Step Deployment

#### 1. Sign Up for Cloudflare

1. Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Sign up with email
3. Click **"Create a Pages project"**

#### 2. Connect Repository

1. Click **"Connect GitHub account"**
2. Select your repository
3. Click **"Begin setup"**

#### 3. Configure Build

| Setting | Value |
|---------|-------|
| Project name | Your project name |
| Production branch | `main` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | (leave empty) |

#### 4. Deploy

Click **"Save and Deploy"**

#### 5. Access Your Site

Your site will be available at:
```
https://your-project.pages.dev
```

### Advanced Configuration

#### Environment Variables

1. Go to **Project Settings** → **Environment variables**
2. Add your variables

#### Custom Domains

1. Go to **Custom domains**
2. Enter your domain
3. Follow verification steps

#### Functions

Cloudflare Pages supports serverless functions:

```javascript
// functions/api/hello.js
export async function onRequestGet(context) {
  return new Response(JSON.stringify({ message: 'Hello!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## 🏠 Self-Hosting

**Best for:** Full control, custom servers  
**Cost:** Varies (server costs)  
**Ease:** ⭐⭐⭐  
**Features:** Full control, custom configurations

### Option 1: Static File Hosting

Simply upload the `dist` folder to any web server:

```bash
# Build the site
pnpm build

# Upload to server (example with scp)
scp -r dist/ user@your-server:/var/www/html/
```

### Option 2: Docker Container

Create `Dockerfile`:

```dockerfile
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source files
COPY . .

# Build the site
RUN pnpm build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
# Build image
docker build -t my-blog .

# Run container
docker run -d -p 80:80 --name my-blog my-blog
```

### Option 3: PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Install express
pnpm add express

# Start with PM2
pm2 start server.js --name my-blog

# Save and startup on boot
pm2 save
pm2 startup
```

---

## 🌍 Custom Domain Setup

### For GitHub Pages

1. **Create CNAME file:**
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure in GitHub:**
   - Go to **Settings** → **Pages**
   - Enter your custom domain
   - Click **Save**

3. **Configure DNS:**
   - Add A records pointing to GitHub IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add CNAME record pointing to `your-username.github.io`

4. **Update site URL:**
   ```javascript
   // In astro.config.mjs
   site: 'https://your-domain.com',
   ```

### For Netlify/Vercel/Cloudflare

1. **Add domain in hosting provider:**
   - Go to domain settings
   - Add your custom domain
   - Follow verification steps

2. **Configure DNS:**
   - Add A record or CNAME as instructed
   - Wait for DNS propagation (up to 48 hours)

3. **Update site URL:**
   ```javascript
   // In astro.config.mjs
   site: 'https://your-domain.com',
   ```

### SSL Certificate

All major hosting providers (GitHub Pages, Netlify, Vercel, Cloudflare) provide **free SSL certificates** automatically. No manual configuration needed!

---

## ✅ Deployment Checklist

### Before Deployment

- [ ] All content is ready
- [ ] Site URL configured in `astro.config.mjs`
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] Favicon added
- [ ] Meta tags configured
- [ ] All links work
- [ ] Images optimized
- [ ] Tested locally (`pnpm dev`)

### After Deployment

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Links work
- [ ] Images load
- [ ] Forms work (if applicable)
- [ ] Analytics tracking (if configured)
- [ ] SSL certificate valid
- [ ] Performance is good (check Lighthouse)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Site Shows 404

**Possible causes:**
- GitHub Pages not enabled
- Wrong publish directory
- Custom domain not configured correctly

**Solutions:**
```bash
# Check GitHub Pages settings
# Ensure source is set to GitHub Actions or /dist

# Check build output
ls -la dist/  # Should contain index.html

# Check custom domain configuration
cat public/CNAME  # Should contain your domain
```

#### 2. Styles Not Loading

**Possible causes:**
- Wrong base path
- CSS files not built
- Cache issues

**Solutions:**
```bash
# Rebuild the site
pnpm build

# Check if CSS files exist
ls -la dist/_astro/  # Should contain CSS files

# Clear cache
rm -rf .astro cache
pnpm build
```

#### 3. Images Not Loading

**Possible causes:**
- Wrong image paths
- Images not in public folder
- Case sensitivity issues

**Solutions:**
```bash
# Use correct paths
# Images in public/ -> /images/my-image.jpg
# Images in src/ -> import myImage from '../images/my-image.jpg'

# Check image paths in HTML
# Should be /images/my-image.jpg (not images/my-image.jpg)
```

#### 4. Build Fails

**Possible causes:**
- Node.js version too old
- Missing dependencies
- Syntax errors

**Solutions:**
```bash
# Check Node.js version
node --version  # Must be ≥24.0.0

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check error message
pnpm build 2>&1 | grep -A 5 "error"
```

#### 5. Environment Variables Not Working

**Possible causes:**
- Missing `PUBLIC_` prefix
- Variables not set in hosting provider
- Wrong variable names

**Solutions:**
```bash
# Check .env file
cat .env  # Should have PUBLIC_ prefix

# Check variable names in code
# Must match exactly (case-sensitive)

# Set variables in hosting provider
# GitHub: Settings → Secrets
# Netlify: Site settings → Environment variables
# Vercel: Project settings → Environment variables
```

#### 6. Supabase Connection Fails

**Possible causes:**
- Wrong URL or key
- RLS policies blocking access
- Network issues

**Solutions:**
```bash
# Check .env
cat .env | grep SUPABASE

# Test connection locally
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY); console.log(await supabase.from('posts').select('*').limit(1))"

# Check RLS policies in Supabase
# Go to: Authentication → Policies
```

---

## 📊 Deployment Comparison

| Feature | GitHub Pages | Netlify | Vercel | Cloudflare Pages | Self-Hosting |
|---------|--------------|---------|--------|------------------|--------------|
| **Cost** | Free | Free tier | Free tier | Free | Varies |
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **SSL** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Manual |
| **CDN** | ✅ GitHub | ✅ Global | ✅ Global | ✅ Global | ❌ Depends |
| **CI/CD** | ✅ GitHub Actions | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ Manual |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Serverless Functions** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Form Handling** | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ Manual |
| **Preview Deployments** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Edge Functions** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ Depends |

---

## 🎯 Recommendations

### For Personal Blogs
- **Use GitHub Pages** - Free, easy, integrates with template
- **Use Cloudflare Pages** - Free, great performance, CDN

### For Professional Sites
- **Use Vercel** - Best for Astro, preview deployments, edge functions
- **Use Netlify** - Great features, form handling, easy to use

### For Full Control
- **Use Self-Hosting** - Docker, PM2, or static file hosting

---

## 📚 Additional Resources

- **[GitHub Pages Docs](https://pages.github.com/)** - Official GitHub Pages documentation
- **[Netlify Docs](https://docs.netlify.com/)** - Netlify documentation
- **[Vercel Docs](https://vercel.com/docs)** - Vercel documentation
- **[Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)** - Cloudflare Pages documentation
- **[Astro Deployment Docs](https://docs.astro.build/en/guides/deploy/)** - Astro deployment guide

---

## 💬 Need Help?

- **Check [TEMPLATE.md](TEMPLATE.md)** for quick start
- **Check [SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed setup
- **Check [ARCHITECTURE.md](ARCHITECTURE.md)** for technical details
- **Check [CUSTOMIZATION.md](CUSTOMIZATION.md)** for customization options

---

**Happy deploying! 🚀**

*Deployment guide for HanBin-Baik-Blog template*
