#!/bin/bash

# Test script to verify version detection logic

test_version_detection() {
  local branch_name="$1"
  local commit_msg="$2"
  local expected="$3"
  
  # Simulate the detection logic - match the workflow exactly
  VERSION_TYPE="patch"  # default
  
  # First check commit message for breaking changes (highest priority)
  if [[ "$commit_msg" == *"BREAKING CHANGE"* ]] || [[ "$commit_msg" == *"feat!"* ]]; then
    VERSION_TYPE="major"
  # Then check branch name (medium priority)
  elif [[ "$branch_name" == *"major"* ]] || [[ "$branch_name" == *"breaking"* ]]; then
    VERSION_TYPE="major"
  elif [[ "$branch_name" == *"feat"* ]] || [[ "$branch_name" == *"feature"* ]] || [[ "$branch_name" == *"minor"* ]]; then
    VERSION_TYPE="minor"
  elif [[ "$branch_name" == *"fix"* ]] || [[ "$branch_name" == *"hotfix"* ]] || [[ "$branch_name" == *"patch"* ]]; then
    VERSION_TYPE="patch"
  # Finally check commit message (lowest priority)
  elif [[ "$commit_msg" == *"feat:"* ]] || [[ "$commit_msg" == *"feat("* ]]; then
    VERSION_TYPE="minor"
  elif [[ "$commit_msg" == *"fix:"* ]] || [[ "$commit_msg" == *"fix("* ]]; then
    VERSION_TYPE="patch"
  fi
  
  if [[ "$VERSION_TYPE" == "$expected" ]]; then
    echo "✅ PASS: '$branch_name' + '$commit_msg' → $VERSION_TYPE"
  else
    echo "❌ FAIL: '$branch_name' + '$commit_msg' → $VERSION_TYPE (expected: $expected)"
  fi
}

echo "🧪 Testing version detection logic..."
echo

# Branch name tests
test_version_detection "feat/new-component" "" "minor"
test_version_detection "feature/dark-mode" "" "minor"
test_version_detection "fix/button-bug" "" "patch"
test_version_detection "hotfix/critical-error" "" "patch"
test_version_detection "major/api-redesign" "" "major"
test_version_detection "patch/typo" "" "patch"

# Commit message tests
test_version_detection "random-branch" "feat: add new component" "minor"
test_version_detection "random-branch" "fix: resolve alignment issue" "patch"
test_version_detection "random-branch" "feat!: breaking API change" "major"
test_version_detection "random-branch" "feat: add feature

BREAKING CHANGE: API has changed" "major"

# Mixed tests (branch takes precedence in current logic)
test_version_detection "feat/new-thing" "fix: some fix" "minor"
test_version_detection "fix/some-bug" "feat: some feature" "patch"

echo
echo "🏁 Version detection tests completed!"