---
name: database-review
description: Analyze database schema and queries for optimization
argument-hint: "[schema_file] - SQL schema file or database diagram. Defaults to auto-detect"
model: sonnet
budget: 3
---

# /database-review - Optimize Database

Review database schema design and query patterns for performance and correctness.

## What it does

1. **Analyzes schema** - Reviews table structure, relationships, indexes
2. **Checks queries** - Identifies N+1, missing indexes, inefficient patterns
3. **Framework context** - Considers ORM-specific issues
4. **Recommendations** - Prioritized optimization suggestions

## Usage

```
/database-review                    # Auto-detect schema
/database-review schema.sql         # Analyze SQL file
/database-review migrations/        # Review migration directory
```

## Output

```
📊 Database Review

SCHEMA ANALYSIS:
✅ Tables: 12
✅ Relationships: 14 (all properly defined)
✅ Primary Keys: All tables have PK ✅

INDEXES:
🔴 CRITICAL: Missing index on orders.user_id
   - Column used in WHERE clause frequently
   - Estimated improvement: 10x query speed
   - SQL: CREATE INDEX idx_orders_user_id ON orders(user_id);

🟡 WARNING: Redundant composite index
   - idx_user_email covers same columns as idx_user_email_status
   - Recommendation: Drop one to save storage

QUERIES:
🔴 N+1 Pattern Detected
   - File: UserRepository.cs:45
   - Load all users, then query orders per user
   - Fix: Use Include/prefetch in single query
   - ORM: .Include(u => u.Orders)

🟡 Full Table Scan Risk
   - Query: SELECT * FROM users WHERE status = 'active'
   - No index on status column
   - Fix: CREATE INDEX idx_users_status ON users(status);

PERFORMANCE METRICS:
- Largest table: orders (2.5M rows)
- Current indexes: 18
- Recommended indexes: 22
- Potential improvement: 30-40% faster queries

RECOMMENDATIONS (Priority Order):
1. Add index on orders.user_id (CRITICAL)
2. Add composite index on orders(user_id, created_at DESC)
3. Analyze table bloat with VACUUM ANALYZE
4. Consider partitioning large tables
5. Archive old orders (>2 years)

Database: PostgreSQL 14.2
```

## Framework-Specific

**For .NET + EF Core:**

- Detects missing Include/ThenInclude
- Checks for lazy loading issues
- Validates migration best practices

**For Django + ORM:**

- Finds N+1 in queries and serializers
- Checks select_related/prefetch_related
- Reviews transaction handling

**For Next.js + Prisma:**

- Finds missing includes
- Checks query efficiency
- Reviews relation loading

## References

Uses **sql-patterns** skill for optimization recommendations.
