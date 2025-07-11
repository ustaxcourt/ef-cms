#!/bin/bash -e

[[ -z "$1" ]] && echo "Pass the target branch as the first parameter" && exit 1
SOURCE=$(git branch --show-current)
TARGET="$1"
[[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
[[ -z $(git ls-remote --heads origin "$TARGET") ]] && echo "Target branch does not exist" && exit 1
PROTECTED_BRANCHES="develop prod staging test"
# shellcheck disable=SC2076
[[ " $PROTECTED_BRANCHES " =~ " $TARGET " ]] && echo "Unable to force push to ${TARGET}" && exit 1
[[ -n $(git diff) ]] && echo "Stash or commit local changes first" && exit 1

HEAD_REV=$(git rev-parse HEAD)
git checkout "$TARGET"
git reset --hard "$HEAD_REV"
git push --force

git checkout "$SOURCE"
git pull
