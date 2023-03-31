#!/bin/bash

CURRENT_REPO_URL=$(git remote get-url origin)
COURT_REPO="https://github.com/ustaxcourt/ef-cms.git"
SOURCE_BRANCH=$(git branch --show-current)
ORG=$(echo "$CURRENT_REPO_URL" | awk -F/ '{print $4}')

INTERMEDIATE_BRANCH="${SOURCE_BRANCH}-intermediate-branch-to-test-$(date +%s)"

git switch -c "$INTERMEDIATE_BRANCH"
git pull --no-edit "$COURT_REPO" test

# catch merge conflict and fix in current intermediate branch
# shellcheck disable=SC2143
if [[ -n $(git status --porcelain | grep '^UU') ]]; then
    echo "Merge conflict detected. Please resolve the conflict and try again."
    exit 1
fi

git push -u origin "$INTERMEDIATE_BRANCH"

open "https://github.com/ustaxcourt/ef-cms/compare/test...${ORG}:${INTERMEDIATE_BRANCH}"


