# Phase 4B: Headless Claude Code Integration - Setup Guide

**Status**: Ready for activation
**Model**: Sonnet 4.5 (Claude Code)
**Budget**: $50/month
**Timeline**: Ready to deploy

## Overview

Phase 4B integrates Claude Code into GitHub Actions for **automated PR reviews, documentation sync, architecture analysis, and plugin testing**. This brings AI-powered intelligence to your CI/CD pipeline.

### What's New in Phase 4B

✅ **PR Code Review** - Claude analyzes every PR for quality, security, and performance
✅ **Documentation Sync** - Auto-updates docs when code changes
✅ **Architecture Analysis** - Weekly deep codebase reviews
✅ **Plugin Testing** - Automated validation on plugin changes

## Prerequisites

Before activating Phase 4B, you need:

1. **Anthropic API Key** - Get one at: https://console.anthropic.com/settings/keys
2. **GitHub Repository Access** - You're reading this, so ✅
3. **GitHub Secrets Configuration** - Add API key to repository

## Step 1: Create Anthropic API Key

If you don't already have an API key:

1. Visit: https://console.anthropic.com/settings/keys
2. Click "Create key"
3. Copy the key (starts with `sk-ant-`)
4. Keep this safe - you'll use it in Step 2

## Step 2: Add API Key to GitHub Secrets

This is the **critical step** that enables Phase 4B.

### Via GitHub Web UI (Recommended):

1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. **Name**: `ANTHROPIC_API_KEY`
5. **Value**: Paste your key from Step 1 (starts with `sk-ant-`)
6. Click **"Add secret"**

### Via GitHub CLI:

```bash
gh secret set ANTHROPIC_API_KEY --body "sk-ant-your-key-here"
```

### Verification:

```bash
gh secret list
# Should show: ANTHROPIC_API_KEY        Updated Oct 09, 2024
```

## Step 3: Verify Setup

The workflows are now ready. To verify:

1. **Check workflows are enabled**:

   ```bash
   cat .github/workflows/claude-pr-review.yml | grep "^on:"
   # Should show: on: with pull_request trigger
   ```

2. **Review CI config**:

   ```bash
   cat .claude/ci-config.json | grep -A5 '"prReview"'
   ```

3. **Commit and push**:
   ```bash
   git add .github/workflows/claude-pr-review.yml .claude/ci-config.json
   git commit -m "feat: activate Phase 4B headless Claude integration"
   git push
   ```

## Step 4: Test PR Review Workflow

Create a test PR to verify everything works:

```bash
# Create test branch
git checkout -b test-phase4b
echo "# Phase 4B Test" >> README.md
git add README.md
git commit -m "test: verify Claude PR review workflow"
git push -u origin test-phase4b

# Create PR on GitHub
# Go to: https://github.com/moncalaworks-cpu/ClaudeTwo/compare/main...test-phase4b
# Click "Create pull request"
```

**Expected**: Within 1-2 minutes, you should see a Claude code review comment on the PR.

### If Review Doesn't Appear:

1. **Check API key is set**:

   ```bash
   gh secret list | grep ANTHROPIC_API_KEY
   ```

2. **Review workflow logs**:
   - Go to PR → Actions tab → `Claude PR Code Review` workflow
   - Click the latest run to see logs
   - Look for error messages

3. **Common issues**:
   - ❌ "ANTHROPIC_API_KEY not set" → Follow Step 2 again
   - ❌ "claude: command not found" → Node.js/npm issue in action
   - ❌ "Authentication failed" → API key invalid, regenerate at console.anthropic.com

## Workflow Behaviors

### PR Code Review (claude-pr-review.yml)

**Triggers on**: PR opened, updated, or reopened
**Model**: Sonnet (best quality)
**Cost**: ~$0.20-0.50 per review
**Output**: Comment on PR with feedback

**Review focuses on**:

- Code quality and architecture
- Security vulnerabilities (OWASP top 10)
- Performance concerns
- Test coverage gaps
- Documentation needs

### Documentation Sync (claude-docs-sync.yml)

**Status**: Available, triggers on code changes to main
**Model**: Haiku (fast and cheap)
**Cost**: ~$0.05-0.15 per sync
**Output**: Auto-commits updated ARCHITECTURE.md

### Architecture Analysis (claude-architecture-analysis.yml)

**Status**: Available for manual trigger
**Model**: Sonnet
**Cost**: ~$2-5 per analysis
**Output**: Architecture report as GitHub issue

### Plugin Testing (claude-plugin-test.yml)

**Status**: Available, triggers on plugin changes
**Model**: Haiku
**Cost**: ~$0.10-0.20 per test
**Output**: Test results in workflow logs

## Cost Monitoring

### Estimated Monthly Costs

| Workflow     | Per-Run | Est. Monthly  | Model  |
| ------------ | ------- | ------------- | ------ |
| PR Review    | $0.50   | $20 (40 PRs)  | Sonnet |
| Docs Sync    | $0.15   | $3 (20 syncs) | Haiku  |
| Architecture | $5.00   | $20 (4/month) | Sonnet |
| Plugin Test  | $0.20   | $7 (35 tests) | Haiku  |
| **Total**    |         | **$50**       |        |

### Budget Alerts

- **75% threshold** ($37.50): First warning
- **90% threshold** ($45): Second warning
- **100% threshold** ($50): Auto-disable workflows

### Monitor Usage

```bash
# Check your Anthropic account usage
# Visit: https://console.anthropic.com/settings/usage

# Or query via CLI:
# (Note: API limit info can be seen in headers)
```

## Troubleshooting

### "API key not found"

```bash
# Fix: Ensure the secret is set correctly
gh secret set ANTHROPIC_API_KEY --body "sk-ant-your-key"
# Wait 1-2 minutes for GitHub to sync
```

### "Claude command not found"

```bash
# The workflow should install it automatically
# Check workflow logs for npm install errors
# If persistent, verify Node.js 18+ in runner
```

### "Review takes too long"

```bash
# Claude reviews are typically 30-60 seconds
# Check workflow run logs for processing status
# Large diffs may take longer (up to 10 minutes)
```

### "Review comment didn't appear"

```bash
# Check if review was actually created
# Review workflow output in Actions tab
# Verify PR number and github token permissions
```

## Next Steps

### Immediate (This Week)

- [ ] Add `ANTHROPIC_API_KEY` to GitHub Secrets
- [ ] Create test PR to verify workflow
- [ ] Review a sample PR comment
- [ ] Check cost tracking in Anthropic console

### Short-term (This Month)

- [ ] Monitor review quality and adjust prompts as needed
- [ ] Enable docs sync if desired
- [ ] Schedule weekly architecture analysis
- [ ] Integrate plugin testing into plugin repos

### Future Enhancements

- Custom review templates per project type
- Integration with Slack notifications
- Advanced cost tracking and reporting
- Integration with more tools (Jira, Linear, Notion)

## Security Best Practices

1. **Rotate API keys quarterly**

   ```bash
   # Set new key in GitHub Secrets
   gh secret set ANTHROPIC_API_KEY --body "sk-ant-new-key"
   ```

2. **Monitor API usage**
   - Weekly checks at console.anthropic.com
   - Set budget alerts at 75% threshold

3. **Audit who has access**

   ```bash
   # Repository Settings → Collaborators & teams
   # Ensure minimal access principle
   ```

4. **Never commit API keys**
   - Already protected by `.gitignore`
   - Verify with: `git status`

## Support & Questions

- **Anthropic Docs**: https://docs.anthropic.com/
- **Claude Code**: `/help`
- **GitHub Actions**: https://docs.github.com/en/actions
- **This Project**: See memory at `/Users/kenshinzato/.claude/projects/-Users-kenshinzato-repos-ClaudeTwo/memory/`

## Status Checklist

- [ ] API key created and copied
- [ ] API key added to GitHub Secrets
- [ ] PR review workflow enabled
- [ ] Test PR created and reviewed
- [ ] Claude comment appeared on PR
- [ ] Cost tracking set up
- [ ] Documentation reviewed and understood

✅ Once all items checked, Phase 4B is **ready for production use**!

---

**Phase 4B Implementation**: Ready to deploy
**Last Updated**: 2026-02-11
**Model Used**: Claude Haiku 4.5
