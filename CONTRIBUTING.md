# Contributing Guide

## 🎉 Welcome!

Thank you for your interest in contributing to **HanBin-Baik-Blog**! We welcome contributions from everyone, whether you're a beginner or an experienced developer.

## 📋 Getting Started

### Prerequisites

- **Node.js:** v24.0.0 or higher (recommended: v26+)
- **pnpm:** v11.0.0 or higher
- **Git:** Latest version

### Local Development Setup

1. **Fork the repository**
   ```bash
   gh repo fork hanbini96/HanBin-Baik-Blog
   cd HanBin-Baik-Blog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Workflow

### Creating a Feature Branch

```bash
# Create a new branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Making Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep commits atomic and well-described

### Committing Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Submitting a Pull Request

1. Push your branch to your fork
2. Open a Pull Request to the main repository
3. Fill out the PR template completely
4. Wait for CI checks to pass
5. Request review from maintainers

## 📝 Pull Request Guidelines

### PR Title Format

- **Feature:** `feat: description of new feature`
- **Bug Fix:** `fix: description of bug fix`
- **Documentation:** `docs: description of documentation changes`
- **Refactor:** `refactor: description of code refactoring`
- **Chore:** `chore: description of maintenance tasks`

### PR Description

Please include:
- Clear description of changes
- Motivation and context
- Screenshots (if UI changes)
- Testing instructions
- Related issues (use `Closes #123` format)

### Review Process

1. **Initial Review:** Maintainers will review within 48 hours
2. **Feedback:** Address all review comments
3. **Approval:** At least one maintainer approval required
4. **Merge:** Maintainers will merge approved PRs

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test --grep "test description"
```

### Test Coverage

- Aim for 80%+ test coverage
- Add tests for new functionality
- Update existing tests when changing behavior

## 📊 Code Style

### Formatting

- Use Prettier for code formatting
- Run `pnpm format` before committing

### Linting

- Use ESLint for JavaScript/TypeScript
- Run `pnpm lint` to check for issues

### Commit Messages

- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- Keep subject line under 50 characters
- Use imperative mood ("Add feature" not "Added feature")

## 🚀 Deployment

### Preview Deployments

- All PRs trigger preview deployments
- Preview URLs are posted in PR comments

### Production Deployment

- Merges to main trigger production deployment
- GitHub Pages deploys automatically
- Supabase migrations run on push to main

## 🤝 Community

### Communication

- **Issues:** Use GitHub Issues for bug reports and feature requests
- **Discussions:** Use GitHub Discussions for general questions
- **Email:** Contact hanbini96@gmail.com for private matters

### Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎓 Learning Resources

- [Astro Tutorial](https://docs.astro.build/en/tutorial/)
- [Supabase Tutorials](https://supabase.com/docs/guides)
- [Modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🙏 Recognition

All contributors will be recognized in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file (if they wish).

---

*Last Updated: November 18, 2026*
*Maintainer: hanbini96@gmail.com*
