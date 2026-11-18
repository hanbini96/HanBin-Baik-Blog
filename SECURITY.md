# Security Policy

## 🔒 Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in HanBin-Baik-Blog, please report it privately via email to:

**Security Contact:** hanbini96@gmail.com

Please include the following information in your report:
- Type of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We will acknowledge your report within 48 hours and provide a timeline for resolution.

## 🛡️ Security Features

### Built-in Protections
- **CodeQL Analysis:** Automated security scanning on all pull requests
- **Branch Protection:** Main branch requires status checks and PR reviews
- **Secret Scanning:** GitHub secret scanning enabled
- **Dependency Updates:** Regular dependency audits

### Environment Security
- **Supabase:** Production database uses SSL connections and row-level security
- **GitHub Pages:** Static site hosting with no server-side code execution
- **Turnstile:** Cloudflare Turnstile for bot protection on forms

## 🔐 Security Best Practices

### For Contributors
1. **Never commit secrets** - Use GitHub secrets for sensitive data
2. **Use HTTPS** - All connections must use encrypted protocols
3. **Validate inputs** - Always sanitize user inputs
4. **Keep dependencies updated** - Regularly update packages

### For Maintainers
1. **Review all PRs** - At least one approval required for main branch
2. **Monitor security alerts** - Respond to GitHub security notifications
3. **Rotate secrets regularly** - Update secrets every 90 days
4. **Audit permissions** - Review repository access quarterly

## 📋 Security Checklist

- [x] Branch protection enabled
- [x] CodeQL scanning configured
- [x] Secret scanning enabled
- [x] Dependencies regularly updated
- [ ] Security audit completed (quarterly)
- [ ] Incident response plan documented

## 🚨 Incident Response

In case of a security incident:

1. **Containment:** Isolate affected systems
2. **Assessment:** Determine scope and impact
3. **Notification:** Inform affected users if applicable
4. **Remediation:** Apply fixes and patches
5. **Post-mortem:** Document lessons learned

## 📚 Additional Resources

- [GitHub Security Documentation](https://docs.github.com/en/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/security)

---

*Last Updated: November 18, 2026*
*Security Contact: hanbini96@gmail.com*
