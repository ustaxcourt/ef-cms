#!/bin/bash

# test-post-merge.sh: A script to simulate a git merge and test the post-merge hook.

EFCMS_ROOT=$(realpath "$(dirname "$0")/..")

set -e

GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up test environment...${NC}"

TEST_DIR=$(mktemp -d /tmp/git-merge-test-XXXXXX)
trap 'rm -rf "$TEST_DIR"' EXIT

cd "$TEST_DIR"

git init -q
git config user.email "test@example.com"
git config user.name "Test User"

{
  echo "# Changes"
  echo ""
  echo "## First change"
  echo "- It's good stuff"
} > CHANGES.md
git add CHANGES.md
git commit -m "Initial commit to the master branch" -q

git checkout -b throwaway -q
{
  echo ""
  echo "## Second change"
  echo "- It's even better"
} >> CHANGES.md
git add CHANGES.md
git commit -m "Add new manual steps in the throwaway branch" -q

git checkout master -q
mkdir -p .husky
cp "${EFCMS_ROOT}/.husky/post-merge" .husky/post-merge
chmod +x .husky/post-merge


echo -e "${GREEN}Simulating merge of 'throwaway' into 'master'...${NC}"
PRE_MERGE_HEAD=$(git rev-parse HEAD)
git merge throwaway --no-edit -q
git update-ref ORIG_HEAD "$PRE_MERGE_HEAD"

echo -e "${GREEN}Executing post-merge hook...${NC}"
./.husky/post-merge
echo -e "${GREEN}Test complete.${NC}"
