---
name: security-scan
description: OWASP Top 10 and framework-specific security analysis
argument-hint: "[directory] - Directory to scan. Defaults to current directory"
model: sonnet
budget: 4
---

# /security-scan - Find Security Issues

Comprehensive security analysis covering OWASP Top 10 and framework-specific vulnerabilities.

## What it does

1. **Scans code** - Analyzes for common security issues
2. **Checks patterns** - Identifies vulnerable code patterns
3. **Framework checks** - Applies framework-specific security rules
4. **Priorities issues** - Critical, Warning, Info level findings

## Usage

```
/security-scan                    # Scan entire codebase
/security-scan src/              # Scan specific directory
/security-scan app/api/          # Scan API routes
```

## Output Format

```
🔒 Security Scan Results: ./src

CRITICAL ISSUES (3):
🔴 SQL Injection Risk - Line 45 in UserRepository.cs
   Pattern: String concatenation in SQL query
   Fix: Use parameterized queries or LINQ
   OWASP: A03:2021 - Injection

🔴 Hardcoded Secret - Line 12 in appsettings.json
   Pattern: API key in source code
   Fix: Move to environment variables
   OWASP: A02:2021 - Cryptographic Failures

🔴 Missing CSRF Protection - Line 78 in UserController.cs
   Pattern: No [ValidateAntiForgeryToken] on POST
   Fix: Add ValidateAntiforgeryToken attribute
   OWASP: A01:2021 - Broken Access Control

WARNINGS (5):
🟡 XSS Risk - Line 156 in user-profile.tsx
   Pattern: dangerouslySetInnerHTML
   Fix: Use React's automatic escaping
   OWASP: A03:2021 - Injection

🟡 Weak Password Validation - views.py:234
   Pattern: No minimum length requirement
   Fix: Enforce 12+ character minimum

INFO (2):
ℹ️  Missing security headers
   Recommendation: Add CSP, X-Frame-Options

Summary:
- Critical: 3 (Fix immediately)
- Warnings: 5 (Fix soon)
- Info: 2 (Best practice)

Scan Time: 2.3s
Coverage: 156 files analyzed
```

## Covers

**OWASP Top 10 (2021):**

- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A04: Insecure Design
- A05: Broken Authentication
- A06: Vulnerable Components
- A07: Authentication Failures
- A08: Data Integrity Failures
- A09: Logging/Monitoring
- A10: SSRF

**Framework-specific checks:**

- .NET: Missing [Authorize], hardcoded secrets, SQL injection
- Django: CSRF token missing, SQL injection, XSS in templates
- Next.js: Exposed env vars, XSS, missing middleware

## References

Uses **security-patterns** skill for vulnerability detection.
