# Expansion Roadmap - Adding New Frameworks

**Architecture Validated:** Each new framework requires ~4 hours
**Timeline:** ~1 week per 2 frameworks
**Effort:** Minimal (all patterns proven by MVP)

## Expansion Architecture

The Universal Toolkit is architected for rapid framework expansion:

```
Framework Addition Template:
1. Create detection rules (project-detection.md) - 30 min
2. Create expert skill file - 1.5 hours
3. Adapt command references - 1 hour
4. Create templates (2-3 per framework) - 1 hour

Total per framework: ~4 hours
```

## Planned Frameworks

### v1.1.0 - Python/FastAPI (Q1 2026)

**Detection Rules:**

```
Primary: main.py + from fastapi import FastAPI
Supporting: requirements.txt with "fastapi"
Backup: app/ directory + api/ subdirectory
```

**Skill File:** `fastapi-expert.md`

- FastAPI decorator patterns (@app.get, @app.post)
- Dependency injection (Depends)
- Pydantic models and validation
- Async/await patterns
- SQLAlchemy ORM (async)
- pytest async test patterns

**Templates:**

- fastapi-router.template.py (API router with dependencies)
- fastapi-model.template.py (Pydantic model)
- fastapi-test.template.py (pytest async tests)

**Time:** 4 hours
**Commands:** No changes needed (auto-adapted)
**Skills:** Reference fastapi-expert + sql-patterns

### v2.0.0 - Go/Standard Library (Q2 2026)

**Detection Rules:**

```
Primary: go.mod file
Supporting: main.go with func main()
Backup: *.go files in root
```

**Skill File:** `go-expert.md`

- Package structure and conventions
- Interface patterns and composition
- Goroutines and channels
- net/http server patterns
- database/sql with proper connection pooling
- error handling patterns
- testing with testing package

**Templates:**

- go-handler.template.go (HTTP handler)
- go-model.template.go (Data model)
- go-test.template.go (Table-driven tests)

**Time:** 4 hours
**Database:** Leverage sql-patterns

### v2.0.0 - Rust/Axum (Q2 2026)

**Detection Rules:**

```
Primary: Cargo.toml with [dependencies] axum
Supporting: src/main.rs with async fn main
Backup: src/ directory structure
```

**Skill File:** `rust-expert.md`

- Ownership and borrowing
- Trait patterns and impl blocks
- Async/await with tokio
- Axum routing and handlers
- Database access with sqlx or tokio-postgres
- Error handling with Result and ?
- Testing patterns

**Templates:**

- rust-handler.template.rs (Axum route handler)
- rust-model.template.rs (Domain model with derives)
- rust-test.template.rs (Unit tests with #[tokio::test])

**Time:** 4 hours
**Async:** Leverage performance-patterns

### v2.0.0 - PHP/Laravel (Q2 2026)

**Detection Rules:**

```
Primary: composer.json with "laravel/framework"
Supporting: artisan script
Backup: app/ and routes/ directories
```

**Skill File:** `laravel-expert.md`

- Route definitions and controllers
- Eloquent ORM and relationships
- Blade templating
- Middleware and service providers
- Migration patterns
- Testing with PHPUnit
- Validation and authorization

**Templates:**

- laravel-controller.template.php (Resource controller)
- laravel-model.template.php (Eloquent model with relationships)
- laravel-test.template.php (Feature/Unit tests)

**Time:** 4 hours
**Database:** Leverage sql-patterns

## Implementation Strategy

### Phase 1: FastAPI (1 week)

```
Day 1: Create detection rules + expert skill
Day 2: Create templates (3 templates)
Day 3: Test with real FastAPI projects
Day 4: Documentation and validation
```

**Success Criteria:**

- ✅ Framework detection 100% accurate
- ✅ All 8 commands work with FastAPI projects
- ✅ Template code runs without errors
- ✅ Commands produce actionable output

### Phase 2: Go & Rust (2 weeks)

```
Week 1:
  Mon: Create Go detection + expert skill
  Tue: Create Go templates
  Wed: Test Go with real projects
  Thu: Document Go support

Week 2:
  Mon: Create Rust detection + expert skill
  Tue: Create Rust templates
  Wed: Test Rust with real projects
  Thu: Document Rust support
```

### Phase 3: PHP/Laravel (1 week)

Similar timeline to Phase 1 (independent, can run in parallel)

## Effort Matrix

| Framework   | Detection | Expert Skill | Templates | Testing | Total |
| ----------- | --------- | ------------ | --------- | ------- | ----- |
| FastAPI     | 30 min    | 1.5 hrs      | 1 hr      | 1 hr    | 4 hrs |
| Go          | 30 min    | 1.5 hrs      | 1 hr      | 1 hr    | 4 hrs |
| Rust        | 30 min    | 1.5 hrs      | 1 hr      | 1 hr    | 4 hrs |
| PHP/Laravel | 30 min    | 1.5 hrs      | 1 hr      | 1 hr    | 4 hrs |

**Total for 4 frameworks:** 16 hours

## Validation Checklist

For each new framework, validate:

- [ ] Framework detection works (test with 5 projects)
- [ ] Detection doesn't false-match other frameworks
- [ ] All 8 commands produce output
- [ ] Command output is framework-appropriate
- [ ] Templates are syntax-valid
- [ ] Template code runs without errors
- [ ] Expert skill examples are accurate
- [ ] Documentation is complete

## Code Reuse Strategy

```
Shared across all frameworks:
- project-detection.md detection logic
- sql-patterns skill (SQL is universal)
- security-patterns skill (OWASP is universal)
- performance-patterns skill (caching, async patterns similar)
- testing-patterns skill (AAA pattern universal)

Framework-specific:
- [framework]-expert.md (framework idioms)
- Commands adapt automatically to framework
- Templates unique to framework
```

## Cost Impact

**Per-Framework Added:**

- Setup cost: $0.005 (cached, one-time)
- Detection: < $0.001 (minimal analysis)
- Commands: $0.10-0.50 each (same as existing)

**No price increase for users adding frameworks**

## Documentation Requirements

For each framework:

1. GETTING-STARTED-[FRAMEWORK].md
   - Prerequisites
   - Installation/setup
   - Example project walkthrough
   - Common issues

2. Update plugin.json with new framework

3. Update README-PHASE5.md with framework list

## Future Consideration

After 8+ frameworks, consider:

- **Structured outputs** - JSON schemas for automation
- **Prompt caching** - 50% cost reduction
- **Custom rules** - Allow users to define project detection
- **Analytics** - Track command usage, timing, accuracy

## Success Metrics

- **Adoption:** % of users using toolkit on their framework
- **Commands:** Average commands run per user session
- **Satisfaction:** User feedback on output quality
- **Performance:** Command execution time < 60s
- **Cost:** Average cost per audit < $2.00

## Timeline Overview

```
Current: v1.0.0-MVP (3 frameworks, 56 hours)
├── v1.1.0 (4 hours)  - FastAPI
├── v2.0.0 (12 hours) - Go, Rust, PHP
└── v2.1.0+ (ongoing) - Community frameworks

2 frameworks per quarter = 8 frameworks in 1 year
```

## Maintenance Plan

- Monthly: Update skills with new patterns/best practices
- Quarterly: Major feature additions
- Semi-annually: Add new framework support
- Annually: Major revision (v2.0, v3.0)

---

## Next Steps

1. **Collect user feedback** - Which framework to support next?
2. **Validate FastAPI approach** - Build as proof-of-concept
3. **Establish processes** - Framework addition checklist
4. **Community engagement** - Accept framework contributions

---

**Ready to expand? Start with FastAPI - estimated 4 hours.**
