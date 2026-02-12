# Universal Claude Developer Toolkit - Phase 5 MVP

Production-grade, tech-stack-agnostic Claude plugin suite for any project framework.

## What is This?

A universal developer toolkit that auto-detects your project framework and provides intelligent code analysis, generation, testing, security scanning, and optimization across **3 major frameworks**:

- **.NET/C#** (WinForms, ASP.NET Core, MS SQL Server)
- **Django** (REST Framework, Python, PostgreSQL)
- **Next.js** (TypeScript, React, PostgreSQL)

## Quick Start

### Installation

1. **Clone or download this plugin**
2. **In Claude Code:**
   ```
   /setup
   ```
   This auto-detects your framework and initializes the toolkit.

### First Use Example

```bash
# Initialize toolkit (auto-detects .NET project)
/setup
# Output: ✅ Detected: .NET 8.0, ASP.NET Core API

# Analyze your code
/analyze-code src/
# Returns: Quality score, patterns, issues, recommendations

# Generate tests for a file
/generate-tests src/services/UserService.cs
# Returns: xUnit test file with mocks, edge cases

# Scan for security issues
/security-scan src/
# Returns: OWASP Top 10 findings by priority

# Check database performance
/database-review migrations/
# Returns: Index recommendations, N+1 query detection
```

## Core Commands

| Command                             | Purpose                                      | Best For                |
| ----------------------------------- | -------------------------------------------- | ----------------------- |
| `/setup`                            | Detect framework & initialize                | First run               |
| `/analyze-code [file]`              | Code quality analysis                        | Architecture review     |
| `/generate-tests [file]`            | Create unit/integration tests                | Test-driven development |
| `/generate-component [name] [type]` | Scaffold controllers, models, components     | Bootstrap new code      |
| `/security-scan [dir]`              | OWASP Top 10 analysis                        | Security hardening      |
| `/database-review [schema]`         | Query optimization & indexing                | Performance tuning      |
| `/generate-docs [type]`             | API/Architecture/Setup documentation         | Documentation           |
| `/performance-profile [file]`       | Bottleneck detection (N+1, rendering, async) | Optimization            |

## Framework Support

### ✅ Fully Supported

**1. .NET/C# (ASP.NET Core)**

- EF Core ORM analysis
- Async/await pattern detection
- Dependency injection verification
- xUnit test generation
- MS SQL Server optimization

**2. Django (REST Framework)**

- Django ORM best practices
- N+1 query detection
- DRF serializer analysis
- pytest test generation
- PostgreSQL indexing

**3. Next.js (TypeScript)**

- Server/Client Component patterns
- React hooks validation
- API route structure
- Jest test generation
- Bundle size analysis

## What You Get

### 8 Core Commands

Ready-to-use analysis and generation tools for all frameworks.

### 8 Expert Skills

Comprehensive knowledge bases:

- Framework-specific patterns (dotnet-expert, django-expert, nextjs-expert)
- SQL optimization (sql-patterns)
- Security best practices (security-patterns)
- Performance optimization (performance-patterns)
- Testing strategies (testing-patterns)

### 8+ Reusable Templates

Copy-and-customize scaffolding:

- Controllers, ViewSets, Components
- DbContext, Models
- API routes
- Test examples (xUnit, pytest, Jest)

### Auto-Detection

```
Framework Detection Priority:
1. Definitive markers (.csproj, manage.py, next.config.js)
2. Supporting evidence (package.json, requirements.txt, appsettings.json)
3. Directory patterns (src/, migrations/, app/)
```

## Cost-Effective Design

**Budget-Conscious:**

- Haiku model for setup/basic analysis (fast + cheap)
- Sonnet for complex analysis (accurate + balanced)
- Strategic use of extended thinking only when needed
- Caching of framework detection (1 hour TTL)

**Estimated Costs:**

- `/setup`: $0.005 (one-time, cached)
- `/analyze-code`: $0.10-0.30 per analysis
- `/generate-tests`: $0.20-0.40 per file
- `/security-scan`: $0.15-0.50 per scan
- `/database-review`: $0.10-0.30 per schema
- **Full audit (all commands)**: < $2.00

## Architecture

```
Universal Toolkit
├── Commands (8)
│   ├── setup
│   ├── analyze-code
│   ├── generate-tests
│   ├── generate-component
│   ├── security-scan
│   ├── database-review
│   ├── generate-docs
│   └── performance-profile
├── Skills (8)
│   ├── project-detection
│   ├── dotnet-expert
│   ├── django-expert
│   ├── nextjs-expert
│   ├── sql-patterns
│   ├── security-patterns
│   ├── performance-patterns
│   └── testing-patterns
└── Templates (8+)
    ├── dotnet-controller
    ├── dotnet-dbcontext
    ├── django-viewset
    ├── django-model
    ├── nextjs-server-component
    ├── nextjs-client-component
    ├── nextjs-api-route
    └── test-examples
```

## Workflow Examples

### New Project Setup

```
1. /setup                          # Detect framework
2. /generate-component User model  # Create entities
3. /generate-component UserService service
4. /generate-component UserController controller
5. /generate-tests UserService.cs  # Create tests
6. /security-scan src/             # Check security
7. /generate-docs api              # Create API docs
```

### Code Review

```
1. /analyze-code [file]     # Find issues
2. /security-scan src/      # Security review
3. /database-review schema/ # Query optimization
4. /performance-profile src/ # Find bottlenecks
```

### Refactoring

```
1. /analyze-code src/            # Identify problems
2. /performance-profile src/     # Find bottlenecks
3. /generate-tests src/          # Create test coverage
4. /security-scan src/           # Verify security
5. /generate-docs architecture   # Document changes
```

## Extensibility

**Designed for Growth:**
Each new framework requires ~4 hours:

1. Add framework detection rules (project-detection.md)
2. Create expert skill (e.g., flask-expert.md)
3. Adapt commands (reference existing framework)
4. Add templates

**Future Framework Candidates:**

- Python (FastAPI, SQLAlchemy)
- Go (standard library, Gorm)
- Rust (Axum, Sqlx)
- PHP (Laravel)
- Ruby (Rails)

## Testing Strategy

### Unit Tests

- ✅ Framework detection accuracy
- ✅ All command outputs validated
- ✅ Template code compiles
- ✅ Skill content accuracy

### Integration Tests

- ✅ Real .NET project
- ✅ Real Django project
- ✅ Real Next.js project
- ✅ Cross-framework command consistency

### Edge Cases Tested

- ✅ Monorepo detection
- ✅ Hybrid projects
- ✅ Unknown frameworks
- ✅ Empty/new projects
- ✅ Large codebase performance

## Documentation

- **README.md** - Overview and quick start (this file)
- **ARCHITECTURE.md** - System design and patterns
- **COMMANDS.md** - Detailed command reference
- **GETTING-STARTED-DOTNET.md** - .NET specific setup
- **GETTING-STARTED-DJANGO.md** - Django specific setup
- **GETTING-STARTED-NEXTJS.md** - Next.js specific setup
- **TROUBLESHOOTING.md** - Common issues and solutions
- **CONTRIBUTING.md** - How to extend the toolkit

## Support & Issues

- Framework detection not working? → Check TROUBLESHOOTING.md
- Want to add a framework? → See CONTRIBUTING.md
- Questions about a command? → See COMMANDS.md
- Framework-specific help? → See GETTING-STARTED-[FRAMEWORK].md

## Version

**v1.0.0-MVP** (2026-02-12)

- ✅ 3 frameworks fully supported
- ✅ 8 core commands
- ✅ 8 expert skills
- ✅ 8+ templates
- ✅ Auto-detection system
- ✅ Comprehensive documentation

**Roadmap for v2.0:**

- Add 2+ new frameworks
- Structured outputs for automation
- Prompt caching for 50% cost reduction
- Analytics dashboard
- Custom rule engine

## License

MIT - See LICENSE file

---

**Ready to start?** Run `/setup` in Claude Code!
