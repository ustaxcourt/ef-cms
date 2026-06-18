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
  REMOTES=$(git remote)
  if ! echo "$REMOTES" | grep -q "upstream"; then
    git remote add upstream "$COURT_REPO"
    git fetch upstream
  fi
  [[ -z $(git ls-remote --heads upstream "$TARGET") ]] && echo "Target branch does not exist" && exit 1
fi
[[ -n $(git diff) ]] && echo "Stash or commit local changes first" && exit 1

TARGET_TS="${TARGET}-$(date +%s)"
INTERMEDIARY="${SOURCE}-to-${TARGET_TS}"
if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  git checkout "$TARGET"
else
  git checkout -b "$TARGET_TS" "upstream/${TARGET}"
fi
git pull
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
open "https://github.com/${COURT_ORG}/ef-cms/compare/${TARGET}...${INTERMEDIARY}"
