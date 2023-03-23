#!/bin/bash

COURT_REPO="https://github.com/ustaxcourt/ef-cms.git"
SOURCE_BRANCH=$(git branch --show-current)
INTERMEDIATE_BRANCH="${SOURCE_BRANCH}-intermediate-branch"

git checkout -b "$INTERMEDIATE_BRANCH"
git pull -n $COURT_REPO test

# handle merge conflicts (if any)
if [[ -n $(git status --porcelain | grep '^UU') ]]; then
    git reset --hard HEAD
    exit
fi

git push origin $INTERMEDIATE_BRANCH

open "https:github.com/ustaxcourt/ef-cms/compare/test...flexion:${INTERMEDIATE_BRANCH}"

git switch -



