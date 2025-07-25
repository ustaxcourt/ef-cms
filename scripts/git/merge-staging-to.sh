#!/bin/bash -e

SOURCE="staging"
[[ -z "$1" ]] && TARGET="$1" || TARGET=$(git branch --show-current)
[[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
[[ -n $(git diff) ]] && echo "Stash or commit local changes first" && exit 1

onbranch=$(git branch --show-current)
[[ "$TARGET" != "$onbranch" ]] && git checkout "$TARGET" && git pull
git merge "origin/${SOURCE}" --no-commit
# shellcheck disable=SC2143
[[ -n $(git status --porcelain | grep '^UU') ]] && echo "Merge conflict encountered" && exit 1
git commit -m "Merge branch '${SOURCE}' into ${TARGET}"
git push
