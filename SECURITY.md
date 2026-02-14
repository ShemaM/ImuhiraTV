# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The Imuhira TV team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@imuhira.com**

Include the following information in your report:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Location** of the affected source code (file path and line number if possible)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept** or exploit code (if possible)
- **Impact assessment** of the vulnerability
- **Suggested fix** (if you have one)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report within 48 hours.

2. **Investigation**: Our team will investigate and determine the severity of the issue.

3. **Updates**: We will keep you informed about our progress toward addressing the vulnerability.

4. **Resolution**: Once the vulnerability is fixed, we will notify you and discuss public disclosure timing.

5. **Credit**: We will credit you for the discovery in our release notes (unless you prefer to remain anonymous).

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days for critical vulnerabilities

## Security Measures

### Current Security Practices

We implement the following security measures:

#### Input Validation
- All user inputs are validated and sanitized
- URL validation for YouTube links and image URLs
- XSS prevention through React's built-in escaping

#### Authentication
- Secure password hashing with bcrypt
- Session management best practices
- Admin routes protected with authentication middleware

#### Data Protection
- Environment variables for sensitive configuration
- Database credentials never exposed in client code
- HTTPS enforced in production

#### Content Security
- Image URLs validated against allowed domains
- YouTube video IDs validated for format
- External links use `rel="noopener noreferrer"`

### Dependencies

We regularly update dependencies to patch known vulnerabilities. Run `npm audit` to check for known issues.

## Security Best Practices for Contributors

When contributing to Imuhira TV, please follow these security guidelines:

### Do NOT

- ❌ Commit secrets, API keys, or credentials
- ❌ Store sensitive data in localStorage
- ❌ Use `dangerouslySetInnerHTML` without sanitization
- ❌ Disable security features for convenience
- ❌ Introduce new dependencies without security review

### DO

- ✅ Validate and sanitize all user inputs
- ✅ Use parameterized queries for database operations
- ✅ Follow the principle of least privilege
- ✅ Keep dependencies up to date
- ✅ Report any security concerns immediately

## Known Security Considerations

### Third-Party Services

This application integrates with:
- **YouTube** (video embeds) - URLs are validated before rendering
- **PostgreSQL** (database) - Queries use Drizzle ORM with parameterized queries

### User-Generated Content

- Comments are stored and displayed with proper escaping
- Rich text content (from admin) uses controlled HTML rendering
- File uploads (if implemented) should be validated for type and size

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Security Advisories
- Release notes

## Contact

For security-related inquiries:
- **Email**: security@imuhira.com
- **Response Time**: Within 48 hours

---

Thank you for helping keep Imuhira TV and its users safe!
