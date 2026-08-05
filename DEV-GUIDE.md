# HanBin-Baik-Blog Development Guide

## 📋 Project Overview

**Project Name**: HanBin-Baik-Blog  
**Framework**: Astro + Supabase + React  
**Type**: Static blog with CMS capabilities  
**Repository**: https://github.com/hanbini96/HanBin-Baik-Blog

---

## 🎯 Development Principles

### Branch Strategy
- **main**: Production-ready code, deployed to GitHub Pages
- **dev-update**: Development branch for testing new features
- **feature branches**: Created from dev-update for individual features

### Environment Separation
- **Development**: Local machine and dev-update branch
- **Staging**: Feature branches with database testing
- **Production**: main branch with live site

### Database Strategy
- **Single database approach**: Use one Supabase database for all environments
- **Migration safety**: Test migrations on feature branches before merging to dev-update
- **Backup consideration**: Regular backups recommended as database grows

---

## 🔧 Technical Stack

### Core Technologies
- **Frontend**: Astro 5.18.0 (static site generation)
- **Styling**: Tailwind CSS 3.4.0
- **React**: React 18.2.0 for interactive components
- **Database**: Supabase PostgreSQL (free tier)
- **Authentication**: Supabase Magic Links
- **Markdown**: marked, react-markdown, remark-gfm

### Project Structure
```
src/
├── components/          # React components (islands)
├── lib/                 # Utility functions and hooks
├── layouts/             # Layout components
├── pages/               # Page routes (static generation)
└── styles/              # Global styles
```

---

## 🚀 Development Workflow

### 1. Setting Up Environment

#### Local Development
```bash
# Clone repository
git clone https://github.com/hanbini96/HanBin-Baik-Blog.git
cd HanBin-Baik-Blog

# Install dependencies (requires pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

#### Environment Variables
- **Required**: None locally (credentials injected via GitHub Actions)
- **Supabase**: Credentials provided as GitHub secrets during deployment
- **Base URL**: Configured in `astro.config.mjs` for GitHub Pages

### 2. Creating New Features

#### Feature Branch Workflow
```bash
# From dev-update branch
git checkout dev-update
git pull origin dev-update

# Create feature branch
git checkout -b feature/[feature-name]

# Make changes and commit
git add .
git commit -m "feat: [description of feature]"

# Push to remote
git push origin feature/[feature-name]

# Create Pull Request to dev-update
```

#### Database Migrations
- **Location**: `supabase/migrations/` directory
- **Format**: SQL files with sequential numbering (e.g., `001_add_feature.sql`)
- **Testing**: Test migrations locally before committing
- **Safety**: Use `supabase db push` to apply to your database

### 3. Testing Strategy

#### Local Testing
- Test all new features locally with `pnpm dev`
- Verify database operations work correctly
- Check responsive design on different screen sizes

#### Database Testing
- Use Supabase dashboard to verify data changes
- Test authentication flows
- Verify RLS policies are working

#### GitHub Actions Testing
- Push to feature branch triggers GitHub Pages deployment
- Database migrations can be tested in staging environment
- Production deployment only from main branch

---

## 🔐 Security Considerations

### Authentication
- **Magic Links**: Email-based authentication via Supabase
- **Protected Routes**: Use `ProtectedLayout` component for admin pages
- **Session Management**: `useAuth` hook handles session state

### Database Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Granular read/write permissions
- **Auth Sync**: Automatic user profile creation from auth.users

### Environment Variables
- **Public**: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
- **Private**: Database connection strings (GitHub secrets)
- **Base URL**: Configured in `astro.config.mjs`

---

## 📊 Database Schema

### Core Tables

#### `public.users`
- Stores user profile information
- Synced with Supabase Auth via trigger
- Readable by everyone, editable by self

#### `public.posts`
- Blog posts with markdown content
- Supports draft/published states
- View tracking and soft deletion

#### `public.comments`
- Reader comments on posts
- Only visible on published posts
- Soft deletion support

### Advanced Features

#### Views
- `v_published_posts`: Published posts with author info
- `v_user_profile`: User profile data
- `v_post_with_comments`: Posts with comment data

#### Functions
- `generate_unique_slug()`: Creates URL-friendly slugs
- `increment_post_views()`: Tracks post views
- `publish_post()`: Publishes a post
- `soft_delete()`: Soft delete for posts/comments

#### Triggers
- Automatic `updated_at` timestamp updates
- Auth user sync to public.users table

---

## 🔄 GitHub Actions Workflows

### 1. GitHub Pages Deployment (github_pages.yml)

**Trigger**: Push to main branch  
**Purpose**: Build and deploy static site to GitHub Pages  
**Environment Variables**:
- `PUBLIC_SUPABASE_URL`: Injected from GitHub secrets
- `PUBLIC_SUPABASE_ANON_KEY`: Injected from GitHub secrets

**Steps**:
1. Checkout code
2. Install Node.js 20
3. Install dependencies
4. Build Astro site
5. Deploy to GitHub Pages

### 2. Database Migrations (db.yml) ⚠️

**Status**: Available but not currently active  
**Trigger**: Push to main branch with changes to `supabase/migrations/`  
**Purpose**: Apply database migrations to Supabase

**Environment Variables**:
- `STAGING_DB_URL`: Supabase staging database connection string
- `PROD_DB_URL`: Supabase production database connection string

**Steps**:
1. Checkout code
2. Install Supabase CLI
3. Push migrations to staging database
4. (Production requires manual approval)

**Recommendation**: Enable this workflow when ready for production database management

---

## 🛠️ Development Tools & Commands

### Essential Commands
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Check for formatting issues
pnpm run format

# Run linting
pnpm run lint
```

### Database Operations
```bash
# Apply migrations locally (requires Supabase CLI)
supabase db push --db-url "postgresql://postgres:password@db.xyz.supabase.co:5432/postgres"

# Generate new migration
supabase migration new [migration-name]

# Apply all migrations
supabase db reset
```

### Git Operations
```bash
# Create feature branch
git checkout -b feature/[name]

# Commit changes
git add .
git commit -m "type: description"

# Push to remote
git push origin feature/[name]

# Create pull request
gh pr create --base dev-update --head feature/[name] --title "[title]" --body "[description]"
```

---

## 📝 Coding Standards

### Commit Message Format
```
type: description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- perf: Performance improvements
- test: Test additions
- chore: Maintenance tasks
```

### Component Structure
- **Astro components**: `.astro` extension for pages and layouts
- **React components**: `.tsx` extension for interactive components
- **Naming**: PascalCase for components, camelCase for functions
- **Props**: TypeScript interfaces for component props

### Styling
- **Tailwind CSS**: Use utility classes for styling
- **Global styles**: Add to `src/styles/global.css`
- **Responsive design**: Mobile-first approach

---

## 🔍 Debugging & Troubleshooting

### Common Issues

#### Database Connection
- **Error**: Missing Supabase credentials
- **Solution**: Ensure secrets are set in GitHub repository
- **Check**: Supabase dashboard for database status

#### Authentication
- **Error**: Magic link not received
- **Solution**: Check Supabase Auth settings
- **Check**: Email service configuration in Supabase

#### Build Issues
- **Error**: Missing environment variables
- **Solution**: Verify `.env` file or GitHub secrets
- **Check**: `astro.config.mjs` for correct base URL

### Debugging Tools
- **Supabase Dashboard**: https://app.supabase.com
- **GitHub Actions**: Check workflow runs for errors
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls to Supabase

---

## 📈 Performance Considerations

### Static Generation
- **Benefit**: Fast page loads (pre-built HTML)
- **Trade-off**: Build time increases with more pages
- **Optimization**: Use `getStaticPaths` for dynamic routes

### React Islands
- **Benefit**: Only hydrate interactive components
- **Trade-off**: More complex component structure
- **Optimization**: Keep components focused and small

### Database Queries
- **Optimization**: Use indexes on frequently queried columns
- **Caching**: Consider caching frequent queries
- **Pagination**: Implement for large datasets

---

## 🎓 Learning Resources

### Astro
- [Astro Documentation](https://docs.astro.build/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro Tailwind Integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/)

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### React
- [React Documentation](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript with React](https://react.dev/learn/typescript)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)

---

## 📞 Support & Community

### Project Maintainer
- **Name**: HanBin Baik
- **Email**: hanbini96@gmail.com
- **GitHub**: @hanbini96

### Community Resources
- **GitHub Issues**: https://github.com/hanbini96/HanBin-Baik-Blog/issues
- **Supabase Community**: https://supabase.com/community
- **Astro Discord**: https://astro.build/chat
- **Tailwind Discord**: https://tailwindcss.com/discord

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
6. Follow the commit message format

---

## 📅 Release Process

### Versioning
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update `package.json` version on releases
- Create Git tags for releases

### Deployment Checklist
- [ ] All tests pass
- [ ] Database migrations applied
- [ ] Build succeeds without errors
- [ ] GitHub Pages deployment successful
- [ ] Production database updated
- [ ] Documentation updated

### Rollback Plan
- GitHub maintains history for rollback
- Database backups available in Supabase
- Previous versions accessible via Git tags

---

## 🔗 Related Projects

### Dependencies
- **Astro**: Static site generator
- **Supabase**: Database and authentication
- **React**: Interactive components
- **Tailwind CSS**: Styling framework

### Similar Projects
- Astro + Supabase templates
- Static blog with CMS capabilities
- Markdown-based content management

---

## 📝 Notes

### Database Strategy Decision
- **Current**: Single database for all environments
- **Future**: Consider second database when:
  - Need to test migrations before production
  - Database size approaches 500MB limit
  - Need different configurations per environment
  - Have real user-generated content to protect

### Development Environment
- **Local**: Full development environment
- **Staging**: Feature branches with database testing
- **Production**: main branch with live site

### Monitoring
- **GitHub Actions**: Monitor workflow runs
- **Supabase Dashboard**: Monitor database performance
- **Google Analytics**: Track site traffic (if configured)

---

## ✅ Quick Reference

### Project Status
- ✅ Database schema configured
- ✅ Authentication working
- ✅ Blog system functional
- ✅ Editor system functional
- ⚠️ Database workflow available but not active
- ⚠️ Second database optional for staging

### Next Steps
1. Enable database workflow when ready
2. Add Supabase secrets to GitHub
3. Test database migrations locally
4. Create feature branches for new development
5. Follow branch strategy for environment separation

---

**Last Updated**: August 2025  
**Project Version**: 0.1.0  
**Maintainer**: HanBin Baik