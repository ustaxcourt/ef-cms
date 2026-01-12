#!/bin/bash -e

[[ -z "$1" ]] && echo "Pass the target branch as the first parameter" && exit 1
SOURCE=$(git branch --show-current)
TARGET="$1"
[[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
[[ -z $(git ls-remote --heads origin "$TARGET") ]] && echo "Target branch does not exist" && exit 1
[[ -n $(git diff) ]] && echo "Stash or commit local changes first" && exit 1

INTERMEDIARY="${SOURCE}-to-${TARGET}-$(date +%s)"
git checkout "$TARGET"
git pull
git checkout -b "$INTERMEDIARY"
git merge "origin/${SOURCE}" --no-commit
# shellcheck disable=SC2143
[[ -n $(git status --porcelain | grep '^UU') ]] && echo "Merge conflict encountered" && exit 1
git commit -m "Merge branch '${SOURCE}' into ${INTERMEDIARY}"
git push --set-upstream origin "$INTERMEDIARY"

open "https://github.com/ustaxcourt/ef-cms/compare/${TARGET}...${INTERMEDIARY}"
