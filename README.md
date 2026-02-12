# ClaudeTwo

A comprehensive learning project exploring Claude's capabilities including plugins, agents, skills, MCPs, and advanced CI/CD automation.

## Project Overview

This project demonstrates:

- ✅ Claude Code plugins and skills
- ✅ Autonomous agents and orchestration
- ✅ Extended thinking and vision capabilities
- ✅ GitHub Actions CI/CD integration
- ✅ Document review and approval workflows
- ✅ Production-ready automation patterns

## Key Features

### Phase 1-3: Claude Capabilities

- **Hooks & Automation** - File protection and automation hooks
- **Extended Thinking & Vision** - Advanced reasoning and image analysis
- **Orchestration** - Multi-agent workflows and coordination

### Phase 4: CI/CD Integration

- **Review & Approval** - Manual document review before production release
- **Disabled Headless Workflows** - Available as reference (4 AI-powered workflows)

## Quick Links

- **[RELEASE-APPROVAL-GUIDE.md](RELEASE-APPROVAL-GUIDE.md)** - Document review & approval workflow
- **[HEADLESS-GUIDE.md](HEADLESS-GUIDE.md)** - Headless Claude Code integration (reference)
- **[PHASE4B-COMPLETION.md](PHASE4B-COMPLETION.md)** - Phase 4B implementation details

## Getting Started

### Local Development

```bash
git clone https://github.com/moncalaworks-cpu/ClaudeTwo.git
cd ClaudeTwo
```

### Workflow Usage

1. **Push code to main** - Triggers review notification
2. **Review documentation** - Check GitHub issue for review checklist
3. **Approve release** - Use GitHub UI to approve deployment
4. **Release created** - Automatic GitHub Release and git tag

## Project Structure

```
ClaudeTwo/
├── .github/workflows/           # GitHub Actions workflows
│   ├── review-and-release.yml   # Manual approval before release
│   └── claude-*.yml             # Disabled AI workflows (reference)
├── .claude/                     # Claude Code configuration
│   ├── ci-config.json           # CI/CD settings
│   └── hooks/                   # Automation hooks
├── plugins/                     # Claude Code plugins
│   ├── greet-plugin/
│   ├── hooks-plugin/
│   ├── deep-analysis-plugin/
│   └── team-orchestration-plugin/
├── RELEASE-APPROVAL-GUIDE.md    # Setup & usage guide
├── HEADLESS-GUIDE.md            # CI/CD reference
├── VERSION                      # Release version
└── README.md                    # This file
```

## Documentation

- **RELEASE-APPROVAL-GUIDE.md** - Complete setup and approval workflow documentation
- **HEADLESS-GUIDE.md** - Headless Claude Code CI/CD patterns (disabled, reference)
- **PHASE4B-COMPLETION.md** - Detailed Phase 4B implementation summary

## Status

**Current Phase:** ✅ Phase 4B Complete
**Last Updated:** February 11, 2026
**Maintainer:** kenshinzato
**Version:** 1.0.0

## License

MIT License - See LICENSE file for details

---

**Note:** Review and approval workflows are active. AI-powered workflows are disabled to save costs but available as complete reference implementations.
