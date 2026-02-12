# Project Detection Skill

Framework detection and configuration loading for Universal Claude Toolkit.

## Overview

This skill enables automatic identification of project technology stacks and loads framework-specific configuration. Supports:

- **.NET/C#** (ASP.NET Core, WinForms, Console)
- **Django** (REST Framework, async views)
- **Next.js** (TypeScript, App Router)

## Detection Strategy

Detection uses a priority-based approach analyzing file structure and configuration files.

### Priority 1: Definitive Markers (Highest confidence)

**Detection Rules:**

#### .NET/C# Projects

```
Primary indicators (in order of confidence):
1. *.csproj files in any directory → .NET project
2. *.sln file → .NET solution
3. global.json → .NET project metadata
4. .NET Framework version: Read from .csproj <TargetFramework> tag
5. Project type: Read from <OutputType> in .csproj
```

**Example Detection:**

```
Project structure:
  src/
    MyApp.csproj          ← Definitive indicator
    Program.cs
  MyApp.sln               ← Definitive indicator
```

#### Django Projects

```
Primary indicators (in order of confidence):
1. manage.py in root → Django project (definitive)
2. requirements.txt + "django" in contents → Django dependency
3. settings.py in any directory → Django settings module
4. django/ directory → Django source
5. urls.py with django patterns → Django routing
```

**Example Detection:**

```
Project structure:
  manage.py              ← Definitive indicator
  myproject/
    settings.py          ← Confirming indicator
    urls.py
  requirements.txt with "Django>=4.0"
```

#### Next.js Projects

```
Primary indicators (in order of confidence):
1. next.config.js → Next.js configuration (definitive)
2. next.config.mjs → Next.js ESM config (definitive)
3. package.json with "next" in dependencies → Next.js dependency
4. app/ or pages/ directory → Next.js routing
5. .next/ directory → Build artifacts
```

**Example Detection:**

```
Project structure:
  next.config.js         ← Definitive indicator
  package.json with "next" in dependencies
  app/
    layout.tsx
    page.tsx
```

### Priority 2: Supporting Evidence (Confirmatory)

**File Structure Patterns:**

| Framework | Directory Patterns                     | File Patterns                                  |
| --------- | -------------------------------------- | ---------------------------------------------- |
| .NET      | `src/`, `bin/`, `obj/`, `Properties/`  | `*.cs`, `*.csproj`, `appsettings.json`         |
| Django    | `migrations/`, `templates/`, `static/` | `models.py`, `views.py`, `urls.py`, `admin.py` |
| Next.js   | `app/`, `pages/`, `public/`, `styles/` | `*.tsx`, `*.jsx`, `api/` routes                |

**Configuration Files:**

| Framework | Config Files                                      | Detection Method                       |
| --------- | ------------------------------------------------- | -------------------------------------- |
| .NET      | `appsettings.json`, `launchSettings.json`         | JSON structure + keys                  |
| Django    | `settings.py`, `wsgi.py`, `asgi.py`               | Python imports, DJANGO_SETTINGS_MODULE |
| Next.js   | `package.json`, `tsconfig.json`, `jest.config.js` | JSON + script commands                 |

### Priority 3: Weak Evidence (Secondary indicators)

**Language/Runtime Markers:**

- Python files + Django patterns → Django
- C# files + .NET patterns → .NET
- TypeScript/JavaScript + React imports → Possibly Next.js

## Detection Algorithm

```
function detectFramework(projectRoot):

  // Priority 1: Definitive markers
  if fileExists(projectRoot, "*.csproj") or fileExists(projectRoot, "*.sln"):
    return "dotnet"

  if fileExists(projectRoot, "manage.py"):
    return "django"

  if fileExists(projectRoot, "next.config.js|next.config.mjs"):
    return "nextjs"

  // Priority 2: Supporting evidence
  if hasFile("package.json"):
    deps = parseJson("package.json").dependencies
    if "next" in deps:
      return "nextjs"
    if "django" in deps:  // Less common but possible in monorepos
      return "django"

  if fileExists("requirements.txt"):
    if "django" or "djangorestframework" in contents:
      return "django"

  if hasFile("appsettings.json"):
    return "dotnet"

  // Priority 3: Weak evidence
  if hasDirectory("app/") and hasFile("package.json"):
    return "nextjs"  // App router pattern

  if hasFile("manage.py"):
    return "django"

  if hasFile("*.csproj"):
    return "dotnet"

  // No match
  return "unknown"
```

## Configuration Loading

After framework detection, load configuration:

### .NET Configuration

```
Load from:
1. appsettings.json
2. appsettings.{environment}.json
3. project.csproj properties:
   - TargetFramework (.NET 6, 7, 8, etc.)
   - OutputType (Library, Exe, WinExe)
   - PropertyGroup values

Store in memory:
- framework_version: "net8.0"
- output_type: "Exe"
- project_type: "ASP.NET Core API"
- dependencies: [list from .csproj]
- test_framework: "xUnit" (if xUnit.net in deps)
```

### Django Configuration

```
Load from:
1. settings.py parsing:
   - DEBUG
   - DATABASES config
   - INSTALLED_APPS
   - MIDDLEWARE
   - REST_FRAMEWORK settings (if DRF)
2. manage.py --version
3. requirements.txt versions

Store in memory:
- django_version: "4.2"
- database_engine: "postgresql" or "sqlite3"
- is_drf: true/false (has djangorestframework)
- has_async: true/false (async_to_sync usage)
- test_framework: "pytest" or "unittest"
```

### Next.js Configuration

```
Load from:
1. package.json:
   - version (Next.js version)
   - scripts (build, dev, test)
   - dependencies
2. next.config.js:
   - typescript support
   - API routes setup
   - middleware config
3. tsconfig.json:
   - TypeScript version
   - strict mode

Store in memory:
- nextjs_version: "14.0"
- typescript_enabled: true
- app_router: true/false
- test_framework: "jest" or "vitest"
- has_tailwind: true/false
```

## Usage Examples

### Example 1: Detect .NET Project

```
Input: /Users/dev/projects/MyAPI/
Files found: MyAPI.csproj, Program.cs, appsettings.json

Detection process:
1. Check *.csproj → FOUND MyAPI.csproj ✓
2. Return "dotnet"
3. Load appsettings.json
4. Read TargetFramework from MyAPI.csproj → "net8.0"

Output:
{
  framework: "dotnet",
  version: "8.0",
  project_type: "ASP.NET Core API",
  test_framework: "xUnit"
}
```

### Example 2: Detect Django Project

```
Input: /Users/dev/projects/myapp/
Files found: manage.py, settings.py, requirements.txt with Django>=4.0

Detection process:
1. Check *.csproj → NOT FOUND
2. Check manage.py → FOUND ✓
3. Return "django"
4. Parse settings.py → Extract database, apps, middleware
5. Parse requirements.txt → Find Django version

Output:
{
  framework: "django",
  version: "4.2",
  database: "postgresql",
  has_drf: true,
  test_framework: "pytest"
}
```

### Example 3: Detect Next.js Project

```
Input: /Users/dev/projects/webapp/
Files found: next.config.js, package.json (with "next": "^14.0"), tsconfig.json

Detection process:
1. Check *.csproj → NOT FOUND
2. Check manage.py → NOT FOUND
3. Check next.config.js → FOUND ✓
4. Return "nextjs"
5. Load package.json, next.config.js, tsconfig.json

Output:
{
  framework: "nextjs",
  version: "14.0",
  typescript: true,
  app_router: true,
  test_framework: "jest",
  has_tailwind: true
}
```

### Example 4: Edge Case - Monorepo

```
Input: /Users/dev/monorepo/
Structure:
  packages/
    api/         ← .NET service
    web/         ← Next.js app
    backend/     ← Django service

Detection strategy:
1. No definitive markers in root
2. Recursively scan subdirectories
3. Build project map:
   - packages/api → dotnet
   - packages/web → nextjs
   - packages/backend → django

Output:
{
  type: "monorepo",
  projects: {
    "api": { framework: "dotnet", version: "8.0" },
    "web": { framework: "nextjs", version: "14.0" },
    "backend": { framework: "django", version: "4.2" }
  }
}
```

## Detection Accuracy

### Confidence Levels

| Scenario                    | Confidence | Accuracy                   |
| --------------------------- | ---------- | -------------------------- |
| \*.csproj found             | 100%       | 100% (.NET definitive)     |
| manage.py found             | 100%       | 100% (Django definitive)   |
| next.config.js found        | 100%       | 100% (Next.js definitive)  |
| package.json + "next" dep   | 95%        | 95% (could be used as lib) |
| requirements.txt + "django" | 90%        | 90% (could be in monorepo) |
| File structure only         | 70%        | 70% (ambiguous)            |

### Edge Cases & Handling

**Monorepo Detection:**

- Multiple frameworks in same repo
- Return map of subprojects
- Allow user to specify which subproject

**Hybrid Projects:**

- .NET frontend with Next.js
- Django backend with React frontend
- Return all detected frameworks
- Prompt user for primary context

**Unknown/Mixed Projects:**

- Language doesn't match common patterns
- Return "unknown"
- Provide list of detected partial markers
- Ask user to specify framework

**Empty/New Projects:**

- Only package.json or requirements.txt exists
- Use dependency hints as weak evidence
- Ask user for confirmation

## Integration Points

This skill is used by:

- **`/setup` command** - Auto-detect framework on first run
- **All other commands** - Check framework to adapt output
- **Skill selection** - Choose appropriate domain skills (dotnet-expert, django-expert, etc.)

## Performance Considerations

- Detection runs once per session
- Caches result in memory
- Re-detection available with `/setup --force`
- Recursive directory scan limited to 5 levels deep
- Timeout: 5 seconds for detection

## References

- [.NET Project File Documentation](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview)
- [Django Project Structure Best Practices](https://docs.djangoproject.com/en/stable/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Skill Version:** 1.0
**Last Updated:** 2026-02-12
**Status:** Ready for implementation
