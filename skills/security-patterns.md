# Security Patterns Skill

OWASP Top 10 mitigation patterns for all three frameworks (.NET, Django, Next.js).

## A01: Broken Access Control

### Authentication Implementation

```
✅ .NET: Use ASP.NET Core Identity with JWT
✅ Django: Use Django authentication + DRF Token/JWT
✅ Next.js: Use NextAuth.js or JWT with middleware

Pattern: Always validate user identity before granting access
```

### Authorization Checks

```csharp
// ✅ .NET: Role-based access control
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteUser(int id) { }

// ✅ Check ownership
public async Task<IActionResult> EditOrder(int id)
{
    var order = await _db.Orders.FindAsync(id);
    if (order.UserId != _user.Id) return Forbid();
    return Ok(order);
}
```

```python
# ✅ Django: Permission checks
@require_http_methods(["GET"])
def get_user_order(request, order_id):
    order = Order.objects.get(id=order_id)
    if order.user != request.user:
        return HttpResponseForbidden()
    return JsonResponse(order)
```

```typescript
// ✅ Next.js: Middleware checks
export function middleware(request: NextRequest) {
  const session = getSession(request);
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

## A02: Cryptographic Failures

### Password Storage

```
❌ Never store plaintext passwords
❌ Don't use simple MD5 or SHA1
✅ Use bcrypt, scrypt, or PBKDF2

.NET: Identity automatically uses PBKDF2
Django: django.contrib.auth uses PBKDF2
Next.js: bcryptjs library
```

### Sensitive Data Protection

```csharp
// ✅ .NET: Encrypt sensitive fields
[Encrypt]
public string SocialSecurityNumber { get; set; }

// ✅ Use HTTPS only
app.UseHttpsRedirection();
```

```python
# ✅ Django: Use field encryption
from cryptography.fernet import Fernet

class User(models.Model):
    ssn = EncryptedField(cipher=Fernet(key))
```

```typescript
// ✅ Next.js: Never expose secrets in client code
// BAD: const apiKey = process.env.API_KEY; // Exposed!
// GOOD: const apiKey = process.env.NEXT_PUBLIC_API_URL; // Public safe
```

## A03: Injection

### SQL Injection Prevention

```
❌ NEVER: "SELECT * FROM users WHERE email = '" + email + "'"
✅ ALWAYS: Use parameterized queries/ORM
```

```csharp
// ✅ .NET: Entity Framework protects by default
var user = await _db.Users.Where(u => u.Email == userEmail).FirstOrDefaultAsync();

// ❌ Raw queries need parameterization
var user = _db.Users.FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {userEmail}");
```

```python
# ✅ Django ORM parameterizes automatically
user = User.objects.filter(email=user_email).first()

# ❌ Avoid raw SQL
User.objects.raw("SELECT * FROM users WHERE email = %s", [user_email])
```

### XSS Prevention

```typescript
// ❌ Dangerous: innerHTML with user data
<div dangerouslySetInnerHTML={{ __html: user.bio }} />

// ✅ Safe: React escapes by default
<div>{user.bio}</div>

// ✅ Sanitize HTML if needed
import DOMPurify from 'dompurify';
<div>{DOMPurify.sanitize(user.bio)}</div>
```

### Command Injection Prevention

```
❌ Never: shell_execute(f"rm {user_file}")
✅ Use: framework file operations or parameterized commands
```

## A04: Insecure Design

### Implement Rate Limiting

```csharp
// ✅ .NET: Use AspNetCoreRateLimit
services.AddMemoryCache();
services.AddHttpContextAccessor();
services.AddInMemoryRateLimiting();

app.UseIpRateLimiting();
```

```python
# ✅ Django: Use django-ratelimit
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/h')
def login_view(request):
    pass
```

```typescript
// ✅ Next.js: Implement rate limiting in API routes
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function POST(request: NextRequest) {
  const ip = request.ip || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return new Response("Rate limited", { status: 429 });
}
```

## A05: Broken Authentication

### Session Management

```
✅ Use secure session cookies:
- HttpOnly flag (prevents XSS access)
- Secure flag (HTTPS only)
- SameSite=Strict (CSRF protection)
```

```csharp
// ✅ .NET: Configure secure cookies
app.UseCookiePolicy(new CookiePolicyOptions
{
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always,
    SameSite = SameSiteMode.Strict
});
```

```python
# ✅ Django: Configure in settings.py
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
```

## A06: Vulnerable & Outdated Components

### Dependency Management

```bash
# ✅ .NET: Check for vulnerabilities
dotnet list package --vulnerable

# ✅ Django: Use pip-audit
pip-audit

# ✅ Next.js: Use npm audit
npm audit
npm audit fix
```

### Keep Dependencies Updated

```
✅ Review updates regularly
✅ Run security scans in CI/CD
✅ Remove unused dependencies
✅ Use dependency pinning for stability
```

## A07: Authentication & Session Management

### Implement MFA

```csharp
// ✅ .NET: Two-factor authentication
var options = new TwoFactorAuthenticationOptions
{
    Provider = "Email",
    PhoneNumber = user.PhoneNumber
};
```

```python
# ✅ Django: Use django-otp
from django_otp.decorators import otp_required

@otp_required
def sensitive_view(request):
    pass
```

## A08: Software & Data Integrity Failures

### Verify Dependencies

```
✅ Use verified package repositories
✅ Check package signatures
✅ Review release notes before upgrading
❌ Don't auto-update critical dependencies
```

### Code Review & Testing

```
✅ Peer review all code changes
✅ Run tests before merging
✅ Use static analysis tools
```

## A09: Logging & Monitoring

### Implement Security Logging

```csharp
// ✅ .NET: Log security events
logger.LogWarning("Failed login attempt from {IP} for user {Username}",
    context.Connection.RemoteIpAddress,
    loginRequest.Username);
```

```python
# ✅ Django: Log authentication events
import logging
logger = logging.getLogger('security')
logger.warning(f"Failed login: {username} from {request.META.get('REMOTE_ADDR')}")
```

```typescript
// ✅ Next.js: Log suspicious activity
console.warn("Potential XSS attempt detected:", {
  userInput: sanitizedInput,
  timestamp: new Date().toISOString(),
  ip: request.ip,
});
```

### Monitor for Attacks

```
✅ Log all authentication attempts
✅ Alert on repeated failures
✅ Monitor for abnormal patterns
✅ Track access to sensitive data
```

## A10: Server-Side Request Forgery (SSRF)

### Validate URLs

```csharp
// ✅ .NET: Validate external URLs
var uri = new Uri(userUrl);
if (!AllowedDomains.Contains(uri.Host))
    throw new InvalidOperationException("Domain not allowed");
```

```python
# ✅ Django: Use URL validator
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator

URLValidator(schemes=['http', 'https'])(user_url)
```

### Restrict Internal Access

```
❌ Don't allow access to internal IPs: 127.0.0.1, 192.168.*, 10.*
✅ Whitelist only required external URLs
✅ Use network segmentation
```

## General Security Practices

### Environment Variables

```
✅ Store secrets in environment variables
✅ Use .env files locally (never commit)
✅ Use GitHub Secrets for CI/CD
✅ Rotate secrets regularly

Format:
API_KEY=your-secret-key
DATABASE_PASSWORD=secure-password
JWT_SECRET=random-generated-token
```

### HTTPS & TLS

```
✅ Always use HTTPS in production
✅ Use TLS 1.2+
✅ Use strong ciphers
✅ Update certificates regularly
```

### Security Headers

```
✅ Content-Security-Policy
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Strict-Transport-Security (HSTS)
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** OWASP Top 10, Authentication, Cryptography, Injection Prevention, Rate Limiting, Logging
