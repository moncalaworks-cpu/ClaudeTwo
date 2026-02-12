---
name: generate-docs
description: Auto-generate API, architecture, or setup documentation
argument-hint: "[type] - Documentation type: api|architecture|setup|contributing"
model: haiku
---

# /generate-docs - Generate Documentation

Automatically create comprehensive documentation for your project.

## What it does

1. **Analyzes code** - Reads project structure and configuration
2. **Generates docs** - Creates framework-appropriate documentation
3. **Includes examples** - Real code examples from your project
4. **Professional format** - Markdown with tables, diagrams, links

## Usage

```
/generate-docs api                   # API documentation
/generate-docs architecture          # Architecture overview
/generate-docs setup                 # Getting started guide
/generate-docs contributing          # Contribution guidelines
```

## Output Examples

**API Documentation (.NET):**

````markdown
# User Management API

## Endpoints

### GET /api/users/{id}

Returns a single user by ID.

**Parameters:**

- `id` (int): User ID

**Response:**

```json
{
  "id": 1,
  "email": "john@example.com",
  "firstName": "John"
}
```
````

**Status Codes:**

- 200 OK
- 404 Not Found
- 401 Unauthorized

````

**Architecture Documentation:**
```markdown
# System Architecture

## Overview
[Diagram with components]

## Layers
1. **API Layer** (Controllers)
   - Handles HTTP requests
   - Validates input

2. **Service Layer** (Services)
   - Business logic
   - Orchestration

3. **Data Layer** (Repository)
   - Database access
   - ORM configuration

## Data Flow
User Request → Controller → Service → Repository → Database
````

**Setup Guide:**

```markdown
# Getting Started

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

## Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Create .env file
4. Run migrations: `npm run migrate`
5. Start dev server: `npm run dev`

## Configuration

- See .env.example for environment variables
```

## Generates

**API Docs:**

- ✅ All endpoints (GET, POST, PUT, DELETE)
- ✅ Request/response schemas
- ✅ Error codes and examples
- ✅ Authentication requirements
- ✅ Rate limiting info

**Architecture Docs:**

- ✅ System overview
- ✅ Component diagram
- ✅ Data flow
- ✅ Design patterns used
- ✅ Tech stack details

**Setup Guide:**

- ✅ Prerequisites
- ✅ Installation steps
- ✅ Configuration
- ✅ Running locally
- ✅ Troubleshooting

**Contributing Guide:**

- ✅ Code standards
- ✅ Git workflow
- ✅ Testing requirements
- ✅ PR process

## References

Uses **dotnet-expert**, **django-expert**, **nextjs-expert** skills for framework-specific content.
