---
name: analyze-code
description: Framework-aware code quality and architecture analysis
argument-hint: "[file_or_directory] - File or folder to analyze. Defaults to current directory"
model: sonnet
budget: 5
---

# /analyze-code - Analyze Code Quality

Perform intelligent code analysis tailored to your framework.

## What it does

1. **Reads code** - Analyzes provided file or directory
2. **Detects patterns** - Identifies architecture, design patterns, anti-patterns
3. **Framework check** - Applies framework-specific best practices
4. **Provides recommendations** - Actionable improvements with priorities

## Usage

```
/analyze-code src/           # Analyze directory
/analyze-code UserService.cs # Analyze single file
/analyze-code                # Analyze current directory
```

## Output

**For .NET/C# Code:**

```
📊 Code Analysis: UserService.cs

Architecture:
- Pattern: Repository pattern ✅
- Dependency injection: Correct ✅
- Async/await: Proper usage ✅

Issues Found:
🔴 CRITICAL: Potential N+1 query in line 45
- Include() not used for related entities
- Impact: High (database performance)
- Fix: Add .Include(u => u.Orders)

🟡 WARNING: Missing error handling in line 78
- Unhandled exception possible
- Impact: Medium

Quality Score: 78/100
```

**For Django Code:**

```
📊 Code Analysis: views.py

Architecture:
- ORM usage: select_related present ✅
- Transaction handling: Atomic decorator ✅
- Async views: Proper await ✅

Issues:
🔴 Serializer creates N+1 queries
- get_orders() in SerializerMethodField
- Fix: Use prefetch_related in viewset
```

**For Next.js Code:**

```
📊 Code Analysis: UserProfile.tsx

Performance:
- Client component correctly marked ✅
- useSWR with deduplication ✅
- Image component optimized ✅

Issues:
🔴 Inline function in dependency array
- Lines 52-55
- Fix: Move outside component or memoize

🟡 Missing error boundary
- Could crash entire app
```

## References

Uses **dotnet-expert**, **django-expert**, **nextjs-expert** skills for framework-specific analysis.
