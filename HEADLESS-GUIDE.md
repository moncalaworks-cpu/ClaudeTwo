# Claude Code Headless Integration Guide

## Overview

This guide explains how to run Claude Code in headless mode within GitHub Actions and other CI/CD environments. Headless mode allows Claude to analyze code, generate content, and perform intelligent automation without human interaction.

**Phase 4B** implements four automated workflows:

1. **PR Code Review** - Intelligent code review on every pull request
2. **Documentation Sync** - Auto-update docs when code changes
3. **Architecture Analysis** - Deep codebase analysis on schedule
4. **Plugin Testing** - Automated plugin functionality testing

---

## Quick Start

### 1. Set Up API Authentication

```bash
# Get your API key from https://console.anthropic.com/settings/keys
export ANTHROPIC_API_KEY="sk-ant-..."

# Verify it works
claude --print "Test headless mode" --model haiku
```

### 2. Add to GitHub Secrets

**Steps:**

1. Go to: **Repository → Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Name: `ANTHROPIC_API_KEY`
4. Value: `sk-ant-...` (your API key)
5. Click **"Add secret"**

### 3. Test Locally

```bash
# Run a workflow locally (requires act: https://github.com/nektos/act)
act -s ANTHROPIC_API_KEY="sk-ant-..."
```

---

## Workflow Details

### PR Code Review Workflow

**File:** `.github/workflows/claude-pr-review.yml`

**Trigger:** Pull request opened/updated

**What it does:**

- Fetches PR diff
- Analyzes code quality, security, performance
- Posts review comment with specific suggestions
- Runs in ~60-120 seconds

**Configuration:**

```yaml
env:
  MODEL: sonnet # Change to 'haiku' for faster, cheaper reviews
  MAX_BUDGET: 2.0 # USD per review
```

**Cost:** $0.20-0.50 per review

**Example Output:**

```markdown
## 🤖 Claude Code Review

### ✅ Strengths

- Clear variable naming
- Good error handling

### ⚠️ Concerns

- Line 42: Potential null pointer exception
  Suggestion: Add null check before accessing property

### 💡 Suggestions

- Consider extracting function to improve readability
```

---

### Documentation Sync Workflow

**File:** `.github/workflows/claude-docs-sync.yml`

**Trigger:** Code changes pushed to main

**What it does:**

- Detects code changes
- Updates ARCHITECTURE.md and README.md automatically
- Commits changes with bot attribution
- Skips if no updates needed

**Configuration:**

```yaml
paths:
  - "src/**/*.ts" # Watch these paths
  - "plugins/**/*.ts"
```

**Cost:** $0.05-0.15 per sync

**Example:** Add new function → docs auto-update with usage examples

---

### Architecture Analysis Workflow

**File:** `.github/workflows/claude-architecture-analysis.yml`

**Trigger:** Manual dispatch or weekly schedule

**What it does:**

- Comprehensive codebase analysis
- Generates architecture report
- Identifies design patterns
- Creates issue with findings
- Uploads artifact for details

**Manual Trigger:**

```bash
# Go to: Actions → Claude Architecture Analysis
# Click "Run workflow"
# Select analysis type: full-codebase | security-focused | performance-review
```

**Scheduled:** Every Monday at 9 AM UTC

**Cost:** $2-5 per analysis

**Output Example:**

```
📊 Architecture Analysis - 2026-02-11

## Key Findings

### Architecture Patterns
- Monolithic with clear plugin system
- MVC-inspired structure in main components
- Strong separation of concerns in plugins

### Risk Assessment
- ⚠️ Missing input validation in 2 places
- ✅ Good error handling overall
- 💡 Could improve logging in async operations
```

---

### Plugin Testing Workflow

**File:** `.github/workflows/claude-plugin-test.yml`

**Trigger:** Plugin file changes

**What it does:**

- Tests each plugin individually
- Validates JSON structure
- Runs functional tests
- Reports results in PR comment
- Supports 4 plugins: greet, hooks, deep-analysis, team-orchestration

**Tested Plugins:**

- ✅ greet-plugin
- ✅ hooks-plugin
- ✅ deep-analysis-plugin
- ✅ team-orchestration-plugin

**Cost:** $0.10-0.20 per plugin test

---

## Authentication & Security

### API Key Management

**DO:**

- ✅ Store in GitHub Secrets
- ✅ Rotate quarterly
- ✅ Use repository-level secrets (not organization)
- ✅ Monitor usage in Anthropic Console
- ✅ Set budget limits

**DON'T:**

- ❌ Commit API keys to repository
- ❌ Hardcode keys in workflows
- ❌ Share keys between organizations
- ❌ Use personal API keys for shared repos

### Key Rotation

```bash
# Steps:
1. Generate new key at console.anthropic.com
2. Update GitHub Secret with new value
3. Delete old key from Anthropic Console
4. Verify workflows still working
```

---

## Cost Management

### Budget Allocation

**Monthly Budget: $50**

| Workflow     | Monthly Runs | Cost/Run | Total   |
| ------------ | ------------ | -------- | ------- |
| PR Reviews   | 40           | $0.50    | $20     |
| Docs Sync    | 20           | $0.15    | $3      |
| Architecture | 4            | $5.00    | $20     |
| Plugin Tests | 35           | $0.20    | $7      |
| **Total**    |              |          | **$50** |

### Cost Controls

**Built-in safeguards:**

```bash
--max-budget-usd 2      # Per-run limit
--model haiku           # Cheaper than sonnet
--output-format json    # Faster parsing
```

**Monitoring:**

1. Check Anthropic Console weekly
2. GitHub Actions logs show all API calls
3. Alerts trigger at 75% and 90% budget

### Cost Optimization Tips

1. **Use Haiku for simple tasks** (saves 70% vs Sonnet)
2. **Batch similar analyses** (runs them together)
3. **Disable unnecessary workflows** (architecture analysis once/week)
4. **Review and prune prompts** (shorter = faster = cheaper)

---

## Troubleshooting

### Common Issues

#### 1. Authentication Failed

```
Error: ANTHROPIC_API_KEY not found
```

**Solution:**

```bash
# Verify secret exists
gh secret list

# Re-add if missing
gh secret set ANTHROPIC_API_KEY

# Check in GitHub UI: Settings → Secrets and variables → Actions
```

#### 2. Claude Code Not Found

```
Error: command not found: claude
```

**Solution:**

```bash
# Workflow should install it automatically
# If not, add to workflow:
- name: Install Claude Code
  run: npm install -g @anthropic-ai/claude-code
```

#### 3. Budget Exceeded

```
Error: Budget limit exceeded
```

**Solution:**

```bash
# Reduce max-budget-usd in workflow
--max-budget-usd 1     # Instead of 2

# Or use cheaper model
--model haiku           # Instead of sonnet
```

#### 4. PR Comment Not Posting

```
Error: Failed to create comment
```

**Solution:**

1. Verify `pull-requests: write` permission
2. Check GitHub token has correct scopes
3. Review workflow logs for details

---

## Running Locally

### Test Workflows Locally

**Using `act`:**

```bash
# Install act: https://github.com/nektos/act
brew install act

# Run workflow
act -j claude-review \
  -s ANTHROPIC_API_KEY="sk-ant-..."

# Run with specific event
act pull_request \
  -s ANTHROPIC_API_KEY="sk-ant-..."
```

### Manual Local Test

```bash
# Test the Claude command directly
export ANTHROPIC_API_KEY="sk-ant-..."

claude --print "Analyze this code: def hello(): print('world')" \
  --model haiku \
  --output-format json \
  --max-budget-usd 1
```

---

## Advanced Configuration

### Custom Models

Change models in `.claude/ci-config.json`:

```json
{
  "models": {
    "quickReviews": "haiku", // Fast & cheap
    "standardReviews": "sonnet", // Balanced
    "deepAnalysis": "opus" // Best quality
  }
}
```

### Disable Workflows

Edit `.github/workflows/*.yml`:

```yaml
on:
  pull_request:
    # Comment out to disable
    branches: [main]
```

### Extend Workflows

**Add custom review logic:**

```bash
claude --print "Review: $CUSTOM_PROMPT" \
  --model sonnet \
  --max-budget-usd 2
```

---

## Monitoring & Analytics

### View Workflow Costs

1. **GitHub Actions tab** → Select workflow → View logs
2. **Anthropic Console** → Monitor usage and costs
3. **Local check:**

```bash
# See your recent API calls
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Track Over Time

```bash
# Store cost logs
date: 2026-02-11
pr-reviews: 3 × $0.50 = $1.50
docs-sync: 1 × $0.15 = $0.15
daily-total: $1.65
weekly-total: $11.55
```

---

## Best Practices

### 1. Start Small

- ✅ Enable one workflow first (PR reviews)
- ✅ Monitor costs and quality
- ✅ Expand to other workflows gradually

### 2. Set Budgets

```yaml
--max-budget-usd 2 # Always set per-run limit
```

### 3. Test Locally

```bash
act -j claude-review -s ANTHROPIC_API_KEY="..."
```

### 4. Monitor Costs Weekly

- Check Anthropic Console
- Review GitHub Actions logs
- Adjust budgets if needed

### 5. Iterate on Prompts

- Start with generic prompts
- Refine based on results
- Update in workflows gradually

### 6. Use Right Tool for Job

- **Haiku** → Simple validation, documentation
- **Sonnet** → Code review, architecture analysis
- **Opus** → Complex reasoning (expensive, use rarely)

---

## Next Steps

1. **Verify setup:**

   ```bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   claude --print "Test" --model haiku
   ```

2. **Add secrets to GitHub:**
   - Settings → Secrets and variables → Actions
   - Add `ANTHROPIC_API_KEY`

3. **Enable workflows:**
   - Workflows auto-run on PR/push
   - Check Actions tab for results

4. **Monitor first runs:**
   - Watch costs in Anthropic Console
   - Verify review quality on first PR
   - Adjust as needed

5. **Scale gradually:**
   - Once PR review stable, enable docs-sync
   - Add architecture analysis weekly
   - Test plugins on changes

---

## Resources

- **Anthropic Console:** https://console.anthropic.com
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Claude API Docs:** https://docs.anthropic.com
- **Claude Code CLI:** Available via `npm install -g @anthropic-ai/claude-code`

---

## Support

**Issues?**

1. Check workflow logs in GitHub Actions tab
2. Review troubleshooting section above
3. Check Anthropic Console for API errors
4. Review `.claude/ci-config.json` settings

**For issues with Claude Code, report at:**
https://github.com/anthropics/claude-code/issues
