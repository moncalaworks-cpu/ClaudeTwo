---
name: setup
description: Auto-detect project framework and initialize toolkit
argument-hint: "[--force] - Force re-detection even if cached"
model: haiku
---

# /setup - Initialize Universal Toolkit

Automatically detect your project's technology stack and prepare the toolkit.

## What it does

1. **Detects framework** - Identifies .NET, Django, or Next.js project
2. **Loads configuration** - Reads framework-specific config files
3. **Caches result** - Stores detection for faster future commands
4. **Validates setup** - Ensures required files and dependencies exist

## Usage

```
/setup                    # Auto-detect and initialize
/setup --force           # Force re-detection
```

## Output

Returns framework information:

```json
{
  "framework": "nextjs",
  "version": "14.0.0",
  "typescript": true,
  "app_router": true,
  "test_framework": "jest",
  "has_tailwind": true,
  "database": "postgresql",
  "status": "✅ Ready for analysis"
}
```

## Examples

**Next.js Project:**

```
$ /setup
✅ Detected: Next.js 14.0.0 (TypeScript)
✅ Test framework: Jest
✅ Features: App Router, Tailwind CSS
✅ Ready for /analyze-code, /generate-tests, /security-scan
```

**Django Project:**

```
$ /setup
✅ Detected: Django 4.2.0
✅ Database: PostgreSQL
✅ API Framework: Django REST Framework
✅ Test framework: pytest
✅ Ready to analyze
```

**Unknown Framework:**

```
⚠️ Could not auto-detect framework
Please specify: dotnet | django | nextjs
```

## Technical Details

Uses **project-detection** skill to:

- Scan for framework-specific files (.csproj, manage.py, next.config.js)
- Parse configuration files (appsettings.json, settings.py, package.json)
- Identify test framework and database preferences
- Cache results for 1 hour (use --force to refresh)
