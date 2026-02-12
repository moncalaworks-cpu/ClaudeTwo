---
name: performance-profile
description: Identify performance bottlenecks and optimization opportunities
argument-hint: "[file_or_type] - File to profile or type: queries|rendering|network"
model: sonnet
budget: 5
---

# /performance-profile - Find Performance Issues

Comprehensive profiling to identify bottlenecks in queries, rendering, async operations, and caching.

## What it does

1. **Analyzes code** - Examines for performance anti-patterns
2. **Detects N+1** - Finds missing eager loading or query batching
3. **Checks async** - Identifies blocking operations
4. **Reviews rendering** - Finds unnecessary re-renders (React)
5. **Suggests fixes** - Prioritized improvements with estimated impact

## Usage

```
/performance-profile src/                  # Profile entire directory
/performance-profile UserService.cs        # Profile single file
/performance-profile queries               # Focus on database queries
/performance-profile rendering             # Focus on React rendering
```

## Output Format

```
⚡ Performance Profile Analysis

CRITICAL BOTTLENECKS (Estimated 40% improvement):

🔴 N+1 Query Pattern - UserRepository.cs:45
   Description: Loading all users, then querying orders for each
   Current: 1 + N queries (101 total)
   Fixed: 1 query with Include
   Impact: 50x faster (100ms → 2ms)
   Code:
     var users = db.Users.ToList();  ❌
     foreach (var u in users) {
       var orders = db.Orders.Where(o => o.UserId == u.Id).ToList();
     }

   Fix:
     var users = db.Users.Include(u => u.Orders).ToList();  ✅

🔴 Missing Index on Frequently Filtered Column
   Column: orders.status
   Table: orders (2.5M rows)
   Query frequency: 1000x per hour
   Impact: 10x faster filtering
   SQL: CREATE INDEX idx_orders_status ON orders(status);

🔴 Synchronous Database Call in UserController
   Method: GetUserAsync (line 78)
   Pattern: await db.Users.Where(...).FirstOrDefault()
   Issue: Blocking thread pool thread
   Impact: Reduced concurrency, thread starvation
   Fix: Use FirstOrDefaultAsync()

MODERATE ISSUES (Estimated 15% improvement):

🟡 Inefficient Serialization
   File: UserSerializer.cs:23
   Method: get_orders() - Queries for each serialized object
   Pattern: N+1 in DRF serializer
   Impact: 100ms per 100 users
   Fix: Use prefetch_related in ViewSet

🟡 Cache Miss Rate
   Pattern: Cache key includes timestamp
   Current miss rate: 45%
   Expected: 5-10%
   Impact: 30-50% improvement with proper cache keys
   Fix: Remove timestamps from cache keys

RENDERING PERFORMANCE (Frontend):

🟡 Unnecessary Re-renders - UserProfile.tsx
   Component: <UserProfile>
   Cause: Inline function in dependency array (line 52)
   Re-renders per session: 50-100
   Impact: 200ms wasted rendering
   Fix: Move function outside component or memoize

🟡 Heavy Component Not Code-Split
   Component: <ReportGenerator>
   Size: 250KB
   Current: Loaded on every page
   Fix: Use dynamic() for lazy loading
   Estimated savings: 50-80KB initial load

ASYNC/CONCURRENCY ISSUES:

⚠️  Sequential Async Operations
   File: dataService.ts:45
   Code: Fetches users then orders sequentially
   Current: 500ms + 300ms = 800ms
   Fixed: Promise.all() in parallel
   Impact: 800ms → 500ms (37% improvement)

CACHING OPPORTUNITIES:

✅ Good: User profile cached for 30 minutes
❌ Bad: API response cached for 5 minutes (too short)
❌ Missing: Product list not cached at all

SUMMARY:
========
Total Issues: 9
  - Critical: 3 (40% improvement)
  - Moderate: 4 (15% improvement)
  - Minor: 2 (5% improvement)

Potential Total Improvement: 60%
Estimated Time to Fix: 2-3 hours
Impact: Very High

Quick Wins (< 30 min):
1. Add missing index on orders.status
2. Move function outside component
3. Use FirstOrDefaultAsync() instead of FirstOrDefault()

Profile Time: 3.2s
Files Analyzed: 156
```

## Detects

**Database Performance:**

- ✅ N+1 query patterns
- ✅ Missing indexes
- ✅ Inefficient queries
- ✅ Missing eager loading
- ✅ Synchronous calls in async methods
- ✅ Large batch operations

**Frontend Performance:**

- ✅ Unnecessary re-renders
- ✅ Large components not code-split
- ✅ Missing Image optimization
- ✅ Inefficient state management
- ✅ Bundle size issues

**Async/Concurrency:**

- ✅ Sequential async operations (should be parallel)
- ✅ Blocking operations
- ✅ Connection pool issues
- ✅ Memory leaks from unclosed resources

**Caching:**

- ✅ Missing cache opportunities
- ✅ Cache invalidation issues
- ✅ Cache key inefficiencies

## References

Uses **performance-patterns** and **sql-patterns** skills for analysis.
