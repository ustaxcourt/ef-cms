#!/bin/bash

COURT_REPO="https://github.com/ustaxcourt/ef-cms.git"
# FLEXION_REPO="https://github.com/flexion/ef-cms.git"



# SOURCE_ORG= # some git command to figure out org [flexion|ustaxcourt]
# SOURCE_BRANCH=$(git branch --show-current)


# git checkout test
# # create new branch "${SOURCE_ORG}:${SOURCE_BRANCH}-to-test-$(date +%s)"
# # merge $SOURCE_BRANCH into new branch
# open "https:github.com/ustaxcourt/ef-cms/compare/test...${INTERMEDIATE_BRANCH}"





# git remote add $COURT_REPO COURT_REPO
SOURCE_BRANCH=$(git branch --show-current)
INTERMEDIATE_BRANCH="${SOURCE_BRANCH}-intermediate-branch"
git checkout -b "$INTERMEDIATE_BRANCH"
git pull -n $COURT_REPO staging
git pull -n $COURT_REPO test


# handle merge conflicts (if any)
if [[ -n $(git status --porcelain | grep '^UU') ]]; then
    echo "THERE ARE MERGE CONFLICTS"
    exit
fi

git push origin $INTERMEDIATE_BRANCH

open "https:github.com/ustaxcourt/ef-cms/compare/test...flexion:${INTERMEDIATE_BRANCH}"

git switch -



