# CLAUDE_FUNDAMENTALS.md

This note is to capture ideas and thoughts while learning about Claude Fundamentals.

## Main Section

A general plugin for knowledge work that natively uses agents.
This is to complete common knowledge work tasks like the ones below.

Common Tasks
- Analyzing project scope, technical structure, business requirements.
- Implement through code, deployment pipelines.
- Maintain and support legacy code bases.





### Claude features

#### Basic
  - context - background info
  - skills - Roles and Capabilities
  - tools - GitHub MCP

#### Intermediate
  - plugins - /greet
  - hooks - PreTool, PostTool, PostToolOnFailure
  - agents -
  - workflows - parallel, sequential, conditional

#### Advanced
  - security - protect tokens
  - vision -
  - CICD pipeline -


### Project Ideas
- TikTok Store Front Web App
- Facebook Market Place scanner


### Internal Comms
- Claude - AI
- GitHub - Repos, Projects, Actions
- Heroku - QA and Prod environments for Next.JS Front End Container, REST API Container, PostGreSQL Database Container

- Google - Email
- Slack - Chat
- Notion - Product Database, Deployment Ledger


### Tech Stack
- Next.JS Front End - Typescript
- Django REST API Framework - Python
- PostGreSQL Database - SQL


### Tech Stack
- Electron Desktop App - Typescript
- Django REST API Framework - Python
- PostGreSQL Database - SQL


## Dump Section
cd /Users/kenshinzato/repos/ClaudeTwo
git remote add origin https://github.com/moncalaworks-cpu/ClaudeTwo.git
git branch -M main
git push -u origin main


/github subscribe moncalaworks-cpu/claudetwo pulls,reviews,issues

/github subscribe moncalaworks-cpu/claude-memory-docs pulls
/github subscribe moncalaworks-cpu/claude-memory-docs pulls,reviews,issues

  /github subscribe moncalaworks-cpu/claude-memory-docs pulls                    # All PR activity
  /github subscribe owner/repo pulls reviews            # Only reviews
  /github subscribe owner/repo issues,pulls,reviews     # Multiple event types
  /github subscribe owner/repo reviews:action:requested # Only review requests


Kill Claude app
pkill -f "claude" || true

Clear Claude cache
rm -rf ~/.claude/cache


Plugin is now enabled and ready. After restarting Claude Code, you'll have access to:

/research-feature "user authentication system"           # Full 4-phase analysis
/review-architecture "microservices architecture"        # Quick 2-phase review
