#!/usr/bin/env bash
set -e

[[ -z "$1" ]] && echo "Pass the target branch as the first parameter" && exit 1

git fetch --all
COURT_ORG="ustaxcourt"
COURT_REPO="https://github.com/${COURT_ORG}/ef-cms.git"
MY_ORG=$(git config --get remote.origin.url | sed -E 's/.*github\.com[:\/]([^\/]+).*/\1/')
SOURCE=$(git branch --show-current)
TARGET="$1"

if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  [[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
  [[ -z $(git ls-remote --heads origin "$TARGET") ]] && echo "Target branch does not exist" && exit 1
else
  UPSTREAM_URL="$(git remote get-url upstream 2>/dev/null || true)"
  [[ -z "$UPSTREAM_URL" ]] && git remote add upstream "$COURT_REPO"
  [[ -n "$UPSTREAM_URL" ]] && [[ "$UPSTREAM_URL" != "$COURT_REPO" ]] && git remote set-url upstream "$COURT_REPO"
  git fetch upstream
  [[ -z $(git ls-remote --heads upstream "$TARGET") ]] && echo "Target branch does not exist" && exit 1
fi
[[ -n $(git status --porcelain) ]] && echo "Stash or commit and push local changes first" && exit 1

TARGET_TS="${TARGET}-$(date +%s)"
INTERMEDIARY="${SOURCE}-to-${TARGET_TS}"
if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  git checkout "$TARGET"
  git pull --ff-only origin "$TARGET"
else
  git checkout -b "$TARGET_TS" "upstream/${TARGET}"
  git pull --ff-only upstream "$TARGET"
fi
git checkout -b "$INTERMEDIARY"
git merge "origin/${SOURCE}" --no-commit

# shellcheck disable=SC2143
[[ -n $(git status --porcelain | grep '^UU') ]] && echo "Merge conflict encountered" && exit 1

git commit -m "Merge branch '${SOURCE}' into ${INTERMEDIARY}"
git push --set-upstream origin "$INTERMEDIARY"

if [[ "$MY_ORG" != "$COURT_ORG" ]]; then
  INTERMEDIARY="${MY_ORG}:${INTERMEDIARY}"
  git branch -D "$TARGET_TS"
fi

set +e

compare_url="https://github.com/${COURT_ORG}/ef-cms/compare/${TARGET}...${INTERMEDIARY}"
if command -v open >/dev/null 2>&1; then
  open "$compare_url" || echo "Open this URL in a browser: ${compare_url}"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$compare_url" || echo "Open this URL in a browser: ${compare_url}"
else
  echo "Open this URL in a browser: ${compare_url}"
fi
