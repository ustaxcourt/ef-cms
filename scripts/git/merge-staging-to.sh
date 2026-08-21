#!/usr/bin/env bash
set -e

SOURCE="staging"
[[ -n "$1" ]] && TARGET="$1" || TARGET=$(git branch --show-current)

git fetch --all
COURT_ORG="ustaxcourt"
COURT_REPO="https://github.com/${COURT_ORG}/ef-cms.git"
MY_ORG=$(git config --get remote.origin.url | sed -E 's/.*github\.com[:\/]([^\/]+).*/\1/')

if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  [[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
else
  UPSTREAM_URL="$(git remote get-url upstream 2>/dev/null || true)"
  [[ -z "$UPSTREAM_URL" ]] && git remote add upstream "$COURT_REPO"
  [[ -n "$UPSTREAM_URL" ]] && [[ "$UPSTREAM_URL" != "$COURT_REPO" ]] && git remote set-url upstream "$COURT_REPO"
  git fetch upstream
fi
[[ -n $(git status --porcelain) ]] && echo "Stash or commit and push local changes first" && exit 1

on_branch=$(git branch --show-current)
[[ "$TARGET" != "$on_branch" ]] && git checkout "$TARGET" && git pull --ff-only origin "$TARGET"
if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  git merge "origin/${SOURCE}" --no-commit
else
  git merge "upstream/${SOURCE}" --no-commit
fi

# shellcheck disable=SC2143
[[ -n $(git status --porcelain | grep '^UU') ]] && echo "Merge conflict encountered" && exit 1

if [[ "$MY_ORG" == "$COURT_ORG" ]]; then
  git commit -m "Merge branch '${SOURCE}' into ${TARGET}"
else
  git commit -m "Merge branch '${COURT_ORG}:${SOURCE}' into ${TARGET}"
fi
git push
