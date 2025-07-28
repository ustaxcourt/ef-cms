#!/bin/bash -e

[[ -z "$1" ]] && echo "Pass the target branch as the first parameter" && exit 1
SOURCE=$(git branch --show-current)
TARGET="$1"
[[ "$TARGET" == "$SOURCE" ]] && echo "Source and target branches are the same" && exit 1
PROTECTED_BRANCHES="develop prod staging test"
# shellcheck disable=SC2076
[[ " $PROTECTED_BRANCHES " =~ " $TARGET " ]] && echo "Unable to force push to ${TARGET}" && exit 1
[[ -n $(git diff) ]] && echo "Stash or commit local changes first" && exit 1

# convert expN to experimentalN
[[ "${#TARGET}" -eq 4 ]] && [[ "${TARGET:0:3}" == "exp" ]] && TARGET="experimental${TARGET:3:4}"

if [[ -z $(git ls-remote --heads origin "$TARGET") ]]; then
  git checkout -b "$TARGET"
  git push --set-upstream origin "$TARGET"
else
  HEAD_REV=$(git rev-parse HEAD)
  git checkout "$TARGET"
  git reset --hard "$HEAD_REV"
  git push --force
fi

git checkout "$SOURCE"
git pull

if [[ -n "$2" ]] && [[ "$2" == "--trigger" ]]; then
  [[ -z "$CIRCLE_PROJECT_SLUG" ]] && echo "You must have CIRCLE_PROJECT_SLUG set in your environment to trigger a deployment" && exit 1
  [[ -z "$CIRCLE_PERSONAL_TOKEN" ]] && echo "You must have CIRCLE_PERSONAL_TOKEN set in your environment to trigger a deployment" && exit 1
  curl --request POST --url "https://circleci.com/api/v2/project/${CIRCLE_PROJECT_SLUG}/pipeline" \
    --header "Circle-Token: ${CIRCLE_PERSONAL_TOKEN}" \
    --header "content-type: application/json" \
    --data "{\"branch\":\"${TARGET}\"}"
fi
