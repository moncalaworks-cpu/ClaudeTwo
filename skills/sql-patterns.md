# SQL Patterns Skill

Optimization patterns for both MS SQL Server and PostgreSQL.

## Query Optimization

### Indexing Strategy

```sql
-- ✅ Create index on frequently filtered columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ✅ Composite index for common filters
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- ✅ Partial index (PostgreSQL) - only active users
CREATE INDEX idx_users_active ON users(email) WHERE is_active = true;

-- ❌ Avoid: Indexing low-cardinality columns
CREATE INDEX idx_users_is_active ON users(is_active); -- Usually only 2 values
```

### Query Patterns

```sql
-- ✅ Use window functions instead of loops
SELECT
    user_id,
    order_id,
    total_amount,
    SUM(total_amount) OVER (PARTITION BY user_id ORDER BY created_at) as running_total
FROM orders;

-- ✅ Use EXPLAIN ANALYZE to check execution plan
EXPLAIN ANALYZE
SELECT u.*, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.is_active = true;

-- ❌ Avoid: N+1 by selecting related data separately
SELECT * FROM users;
-- Then for each user:
SELECT * FROM orders WHERE user_id = ?;

-- ✅ Correct: Use JOIN
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

## MS SQL Server Specific

### Execution Plans

```sql
-- ✅ Check query performance
SET STATISTICS TIME ON;
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
SET STATISTICS TIME OFF;

-- ✅ Identify missing indexes
SELECT * FROM sys.dm_db_missing_index_details;

-- ✅ Update statistics for better query plans
UPDATE STATISTICS users;
```

### Transactions & Locking

```sql
-- ✅ Explicit transaction with proper isolation
BEGIN TRANSACTION;
    UPDATE users SET balance = balance - 100 WHERE id = 1;
    UPDATE users SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- ✅ Handle deadlocks with retry logic
BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE orders SET status = 'completed' WHERE id = @orderId;
    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH;
```

## PostgreSQL Specific

### Full-Text Search

```sql
-- ✅ Create GIN index for full-text search
CREATE INDEX idx_users_search ON users USING GIN(to_tsvector('english', name));

-- ✅ Query with ranking
SELECT id, name, ts_rank(search_vector, query) as rank
FROM users, to_tsquery('english', 'active & user') as query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

### JSON Queries

```sql
-- ✅ Query JSON data efficiently
CREATE INDEX idx_metadata ON users USING GIN(metadata);

-- ✅ Extract and filter JSON
SELECT id, metadata->>'company' as company
FROM users
WHERE metadata->'status'->>'active' = 'true';
```

### JSONB Operators

```sql
-- ✅ JSONB contains operator
SELECT * FROM users
WHERE metadata @> '{"role": "admin"}'::jsonb;

-- ✅ JSONB path queries
SELECT jsonb_object_keys(metadata) as keys
FROM users WHERE id = 1;
```

## Connection Pooling

### Configuration

```sql
-- ✅ PostgreSQL connection pooling with PgBouncer
[databases]
mydb = host=localhost port=5432 dbname=production

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25

-- ✅ MS SQL Server connection string with pooling
Server=localhost;Database=mydb;Integrated Security=true;
Pooling=true;Max Pool Size=100;Min Pool Size=5;
```

## Performance Monitoring

### Key Metrics

```sql
-- ✅ Find slow queries (PostgreSQL)
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- ✅ Find unused indexes (PostgreSQL)
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE indexname NOT IN (
    SELECT indexrelname FROM pg_stat_user_indexes
);

-- ✅ Check table bloat (PostgreSQL)
SELECT schemaname, tablename,
    ROUND(100 * pg_relation_size(schemaname||'.'||tablename) /
    pg_total_relation_size(schemaname||'.'||tablename)) as percent_bloat
FROM pg_tables
WHERE schemaname NOT LIKE 'pg_%';
```

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Coverage:** Indexing, Query Optimization, MS SQL Server, PostgreSQL, Monitoring
