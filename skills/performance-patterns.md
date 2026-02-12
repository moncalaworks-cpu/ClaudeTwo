# Performance Patterns Skill

Optimization patterns for .NET, Django, and Next.js applications.

## Database Performance

### N+1 Query Problem

**Problem:**

```
- Load 100 users: 1 query
- For each user, load their orders: 100 queries
- Total: 101 queries ❌
```

**Solutions:**

.NET - Entity Framework:

```csharp
// ❌ N+1 Problem
var users = db.Users.ToList();
foreach (var user in users) {
    var orders = db.Orders.Where(o => o.UserId == user.Id).ToList();
}

// ✅ Solution: Include
var users = db.Users.Include(u => u.Orders).ToList();

// ✅ Solution: Select with projection
var userOrders = db.Orders
    .Where(o => o.User.IsActive)
    .Select(o => new { o.User.Name, o.Total })
    .ToList();
```

Django - ORM:

```python
# ❌ N+1 Problem
users = User.objects.all()
for user in users:
    orders = user.orders.all()

# ✅ Solution: select_related (ForeignKey)
users = User.objects.select_related('profile').all()

# ✅ Solution: prefetch_related (reverse/many)
users = User.objects.prefetch_related('orders').all()

# ✅ Solution: only() for specific fields
users = User.objects.only('id', 'email').all()
```

Next.js - Data fetching:

```typescript
// ❌ N+1 Problem: Query in loop
for (const userId of userIds) {
  const orders = await fetch(`/api/users/${userId}/orders`);
}

// ✅ Solution: Batch fetch
const orders = await fetch(`/api/orders?userIds=${userIds.join(",")}`);

// ✅ Solution: Server component with single query
async function UsersList() {
  const users = await db.user.findMany({
    include: { orders: true },
  });
}
```

### Query Optimization

```sql
-- ❌ Inefficient: Multiple conditions
SELECT * FROM orders WHERE total > 100 AND status = 'pending';

-- ✅ Optimized: Indexed columns first
CREATE INDEX idx_orders_status_total ON orders(status, total);
SELECT * FROM orders WHERE status = 'pending' AND total > 100;

-- ✅ Use EXPLAIN to verify index usage
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'pending';
```

## Caching Strategies

### In-Memory Caching

.NET:

```csharp
services.AddMemoryCache();

public class CachedUserService
{
    private readonly IMemoryCache _cache;

    public async Task<User> GetUserAsync(int id)
    {
        if (_cache.TryGetValue($"user_{id}", out User user))
            return user;

        user = await _db.Users.FindAsync(id);
        _cache.Set($"user_{id}", user, TimeSpan.FromMinutes(30));
        return user;
    }
}
```

Django:

```python
from django.core.cache import cache

def get_user(user_id):
    cache_key = f'user_{user_id}'
    user = cache.get(cache_key)

    if user is None:
        user = User.objects.get(id=user_id)
        cache.set(cache_key, user, timeout=60*30)

    return user
```

Next.js with SWR:

```typescript
import useSWR from "swr";

export function useUser(id: number) {
  const { data, error, isLoading } = useSWR(`/api/users/${id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });
}
```

### Cache Invalidation

```
Pattern: Update > Invalidate > Fetch

✅ After UPDATE: Delete cache entry
✅ On READ: Check cache, if miss load + cache

❌ Don't: Set long expiry + forget to invalidate
❌ Don't: Cache user-specific data globally
```

## Async & Concurrency

### Async Operations

.NET:

```csharp
// ❌ Blocking operation
var user = db.Users.FirstOrDefault(u => u.Id == id);

// ✅ Non-blocking
var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

// ✅ Parallel operations
var users = await Task.WhenAll(
    db.Users.ToListAsync(),
    db.Orders.ToListAsync()
);
```

Django:

```python
# ✅ Async view
async def get_user(request, user_id):
    user = await sync_to_async(User.objects.get)(id=user_id)
    return JsonResponse({'id': user.id})

# ✅ Parallel queries
users, orders = await asyncio.gather(
    sync_to_async(User.objects.all)(),
    sync_to_async(Order.objects.all)()
)
```

Next.js:

```typescript
// ✅ Parallel data fetching
async function Page() {
  const [users, orders] = await Promise.all([
    fetch("/api/users").then((r) => r.json()),
    fetch("/api/orders").then((r) => r.json()),
  ]);
}

// ✅ Streaming for large datasets
export const revalidate = 0;
export async function GET() {
  const users = await db.user.findMany();
  return new ReadableStream({
    async start(controller) {
      for (const user of users) {
        controller.enqueue(JSON.stringify(user) + "\n");
      }
      controller.close();
    },
  });
}
```

## Frontend Performance

### Code Splitting

```typescript
// ❌ Load everything upfront
import HeavyComponent from './HeavyComponent';

// ✅ Dynamic import with fallback
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <div>Loading...</div>,
});

// ✅ Use on route change
const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });
```

### Image Optimization

```typescript
// ❌ Native img tag
<img src="/large-image.jpg" />

// ✅ Next.js Image component
<Image
    src="/optimized-image.jpg"
    alt="Description"
    width={800}
    height={600}
    priority={false}
    loading="lazy"
    quality={75}
/>
```

### Bundle Size

```bash
# ✅ Analyze bundle
npm run build -- --analyze

# ✅ Remove unused dependencies
npm prune --production

# ✅ Use tree-shaking compatible imports
import { sortBy } from 'lodash-es'; // ✅
import { sortBy } from 'lodash'; // ❌ Full library
```

## Database Connection Pooling

```csharp
// ✅ .NET: Configured automatically
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        "connectionString;Pooling=true;Max Pool Size=100;"
    )
);
```

```python
# ✅ Django: Connection pooling
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,  # Connection reuse timeout
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

```typescript
// ✅ Next.js: Prisma connection pooling
datasource db {
    provider = "postgresql"
    url = env("DATABASE_URL")
    // Handles pooling automatically
}
```

## Monitoring & Profiling

### Key Metrics

```
✅ Response time (< 200ms target)
✅ Database query time (< 100ms)
✅ Memory usage
✅ CPU usage
✅ Cache hit rate
✅ Error rate
```

### Tools

```
.NET:
- Application Insights
- BenchmarkDotNet
- dotTrace

Django:
- django-silk
- New Relic
- DataDog

Next.js:
- Vercel Analytics
- Web Vitals
- Lighthouse
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** N+1 queries, Caching, Async operations, Frontend optimization, Monitoring
