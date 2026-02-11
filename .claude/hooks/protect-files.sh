#!/bin/bash
# Hook script: Prevent edits to sensitive files
# Usage: Registered as PreToolUse hook
# Exit code 0 = allow, Exit code 2 = block

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Define patterns to protect
PROTECTED_PATTERNS=(
  ".env"
  ".env.local"
  ".env.*.local"
  "package-lock.json"
  "yarn.lock"
  ".git/"
  ".git"
  "credentials.json"
  "secrets"
  ".aws/credentials"
  ".ssh/"
  "*.pem"
  "*.key"
  "*.cert"
)

# Check if file matches any protected pattern
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  # Use more precise matching to avoid false positives
  # .git pattern should match .git/ or .git at directory level, not .github/
  if [[ "$pattern" == ".git" ]]; then
    # Match .git/ directory or .git at start/path component
    if [[ "$FILE_PATH" =~ (^|/)\.git(/|$) ]]; then
      echo "🚫 Blocked: Cannot edit '$FILE_PATH'" >&2
      echo "   Reason: Matches protected pattern '$pattern'" >&2
      echo "   This file is critical to project integrity and should not be modified." >&2
      exit 2
    fi
  elif [[ "$FILE_PATH" == *"$pattern"* ]]; then
    # Standard substring match for other patterns
    echo "🚫 Blocked: Cannot edit '$FILE_PATH'" >&2
    echo "   Reason: Matches protected pattern '$pattern'" >&2
    echo "   This file is critical to project integrity and should not be modified." >&2
    exit 2
  fi
done

# File is safe to edit
exit 0
