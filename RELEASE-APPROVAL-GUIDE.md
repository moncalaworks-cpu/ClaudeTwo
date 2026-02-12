# Release Approval & Review Guide

## Overview

This guide explains how to set up and use the **Review & Release to Production** workflow that adds a manual approval gate for document reviews before production releases.

---

## Workflow Architecture

```
Validation Passes
       ↓
Review Notification Created
       ↓
Human Reviews Documentation
       ↓
Reviewer Approves in GitHub UI
       ↓
Production Release Triggered
       ↓
GitHub Release Created & Tagged
```

---

## Setup Instructions

### Step 1: Configure GitHub Environment

This is a one-time setup that enables the approval gate.

**Steps:**

1. Go to: **Repository → Settings → Environments**
2. Click **New Environment**
3. Name: `Production Release`
4. Click **Configure environment**

### Step 2: Enable Required Reviewers

1. Under "Deployment branches and secrets":
   - Check: **Require reviewers** ✓
   - Add team members or specific users who can approve releases

2. Optional - Set deployment branch restrictions:
   - Restrict deployment to `main` branch only
   - This prevents accidental releases from feature branches

3. Click **Save protection rules**

### Step 3: Update VERSION File

The workflow looks for a `VERSION` file in your repository root:

```bash
# Create or update VERSION file
echo "1.0.0" > VERSION
git add VERSION
git commit -m "chore: add VERSION file for releases"
git push
```

If you don't have a VERSION file, the workflow will default to `1.0.0`.

---

## How to Use

### Automatic Trigger

The workflow is triggered automatically when:

1. **Validation workflow passes** (all checks successful)
2. **On main branch** only

No manual action needed to start the review process.

### Manual Review & Approval

**For Reviewers:**

1. Go to **Actions → Review & Release to Production**
2. Find the latest workflow run
3. See the approval-gate job waiting for approval
4. Click **Review deployments** button
5. Select the reviewer (will be you)
6. Choose **Approve and deploy**
7. Add optional comment
8. Click **Approve deployment**

**What Happens:**

- Release job automatically starts after approval
- GitHub Release is created with version tag
- Issue is closed with release notification
- Team is notified of completion

---

## Workflow Details

### Jobs Overview

#### 1. notify-review

- Runs immediately after validation passes
- Creates GitHub Issue with review checklist
- Posts comment on related PR (if any)
- Status: ✅ Automatic

#### 2. approval-gate

- **Requires approval** via GitHub Environment
- No automatic action
- Human reviewer must approve in GitHub UI
- Status: ⏸️ Waiting for human approval

#### 3. production-release

- Runs only after approval
- Creates version tag in git
- Creates GitHub Release
- Closes review issue
- Status: 🚀 Automatic (after approval)

---

## Review Checklist

When reviewing, use this checklist:

- [ ] **Documentation accuracy** - All docs match current code
- [ ] **Completeness** - All features documented
- [ ] **Security** - No API keys or secrets exposed
- [ ] **Code quality** - Comments are clear, examples work
- [ ] **Architecture** - Design decisions documented
- [ ] **Breaking changes** - Migration guide if needed
- [ ] **Formatting** - Markdown is clean and readable
- [ ] **Links** - All internal links work

---

## Approval Methods

### Method 1: GitHub UI (Recommended)

**Easiest for most users:**

1. Go to Actions tab
2. Select latest "Review & Release" workflow
3. Click "Review deployments"
4. Approve in the popup dialog

### Method 2: API/CLI

**For automated approvals (if needed):**

```bash
# Approve using gh CLI
gh run view <RUN_ID> --json status

# Or manually approve in GitHub UI (simpler)
```

---

## Release Flow Example

### Scenario: Releasing v1.2.0

**Timeline:**

```
2:00 PM - Developer pushes code to main
2:05 PM - Validation workflows run automatically
2:15 PM - All validations pass ✅
2:16 PM - Review notification issue created
2:16 PM - Reviewer alerted (via GitHub notification)

[Human Review Happens Here]

3:00 PM - Reviewer approves release in GitHub UI
3:01 PM - Production release job starts
3:02 PM - GitHub Release v1.2.0 created
3:02 PM - Git tag pushed
3:03 PM - Review issue closed
3:03 PM - Release complete! 🚀
```

---

## Customization

### Change Approval Requirements

To require multiple reviewers:

1. **Settings → Environments → Production Release**
2. Under "Required reviewers": Add additional team members
3. GitHub will require ALL to approve before release

### Change Release Naming

Edit `.github/workflows/review-and-release.yml`:

```yaml
TAG="v${{ steps.version.outputs.version }}-${{ steps.version.outputs.timestamp }}"
# Change to:
TAG="release-${{ steps.version.outputs.version }}"
```

### Add Notifications

Add Slack, email, or webhook notifications:

```yaml
- name: Notify team
  run: |
    curl -X POST https://hooks.slack.com/... \
      -d '{"text":"Release v1.2.0 approved!"}'
```

---

## Troubleshooting

### Approval button doesn't appear

**Issue:** "Review deployments" button not showing

**Solutions:**

1. Check that environment "Production Release" exists in Settings
2. Verify you're a required reviewer
3. Wait 2-3 minutes for GitHub to sync
4. Refresh the page

### Release workflow doesn't start after approval

**Issue:** Production release job doesn't run

**Solutions:**

1. Verify approval was actually submitted (not just clicked)
2. Check workflow permissions (repo → Settings → Actions)
3. Ensure main branch is selected
4. Check for syntax errors in workflow file

### VERSION file not found

**Issue:** Release gets version "1.0.0" instead of custom version

**Solutions:**

1. Create VERSION file in repo root: `echo "1.2.0" > VERSION`
2. Commit and push: `git add VERSION && git commit -m "chore: update version"`
3. Re-run workflow

---

## Best Practices

### 1. Review Before Release

- Always have at least one human review documentation
- Use the checklist provided
- Look for outdated information

### 2. Version Management

- Keep VERSION file updated before releases
- Use semantic versioning: MAJOR.MINOR.PATCH
- Document breaking changes in release notes

### 3. Approval Rotation

- Rotate reviewers to spread knowledge
- Document decisions in PR comments
- Link to related issues/PRs

### 4. Release Timing

- Do releases during business hours
- Allow time for issues to be caught
- Don't rush the review process

---

## Security Considerations

### What the Workflow Does

✅ Creates tags and releases
✅ Closes review issues
✅ Sends notifications
❌ Does NOT deploy to servers
❌ Does NOT modify production data

### Protected Actions

- **Approval required** - Release must be manually approved
- **Audit trail** - All approvals logged in GitHub
- **Branch protection** - Only main branch can be released
- **Reviewer validation** - Only designated reviewers can approve

### Sensitive Data

- Do NOT commit `.env` or credential files
- API keys protected by .gitignore
- Review checklist includes security check

---

## FAQ

**Q: Can I skip the review?**
A: No - approval is always required. This is a safety feature.

**Q: How long before release happens after approval?**
A: Usually 30-60 seconds. GitHub Actions processes the approval queue.

**Q: Can I cancel a release after approving?**
A: Yes - stop the workflow run in GitHub Actions before it completes.

**Q: Do I need to update VERSION manually?**
A: Yes - update before pushing code for a new release.

**Q: Can multiple people approve?**
A: Yes - configure "Require reviewers" in environment settings.

**Q: What happens if validation fails?**
A: Review workflow doesn't run. Validation must pass first.

---

## Next Steps

1. **Set up environment:** Follow Setup Instructions above
2. **Add reviewers:** Settings → Environments → Add team members
3. **Test workflow:** Push code to main and watch it trigger
4. **Document decisions:** Add approval notes for team knowledge
5. **Monitor releases:** Check Actions tab for workflow status

---

## Related Files

- **review-and-release.yml** - Main workflow file (`.github/workflows/`)
- **VERSION** - Version file (repository root)
- **RELEASE-APPROVAL-GUIDE.md** - This file
- **HEADLESS-GUIDE.md** - Related CI/CD documentation

---

**Workflow Status:** ✅ Ready to use
**Last Updated:** 2026-02-11
**Approval Required:** Yes
**Environment:** Production Release
