#!/usr/bin/env sh

# test-post-merge.sh: A script to simulate a git merge and test the post-merge hook.

EFCMS_ROOT=$(realpath "$(dirname "$0")/..")
ANY_ERROR=0

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

printf "%bSetting up test environment...%b\n" "$GREEN" "$NC"

TEST_DIR=$(mktemp -d /tmp/git-merge-test-XXXXXX)
trap 'rm -rf "$TEST_DIR"' EXIT

cd "$TEST_DIR"

git init --initial-branch=main -q
git config user.email "test@example.com"
git config user.name "Test User"

{
  echo "# Changes"
  echo ""
  echo "## First change"
  echo "- It's good stuff"
} > CHANGES.md
git add CHANGES.md
git commit -m "Initial commit to the main branch" -q

git checkout -b no-changes -q
echo "some text" > some-other-file.txt
git add some-other-file.txt
git commit -m "Add a file that is not CHANGES.md" -q

git checkout main -q
mkdir -p .husky
cp "${EFCMS_ROOT}/.husky/post-merge" .husky/post-merge
chmod +x .husky/post-merge

printf "%bSimulating merge of 'no-changes' into 'main'...%b\n" "$GREEN" "$NC"
PRE_MERGE_HEAD=$(git rev-parse HEAD)
git merge no-changes --no-edit -q
git update-ref ORIG_HEAD "$PRE_MERGE_HEAD"

printf "%bExecuting post-merge hook...%b\n" "$GREEN" "$NC"
./.husky/post-merge
EXIT_CODE="$?"

if [ "$EXIT_CODE" -eq 0 ]; then
  printf "%bExited with status %s.%b\n" "$GREEN" "$EXIT_CODE" "$NC"
else
  ANY_ERROR=1
  printf "%bExited with status %s.%b\n" "$RED" "$EXIT_CODE" "$NC"
fi

git checkout -b throwaway -q
{
  echo ""
  echo "## Second change"
  echo "- It's even better"
} >> CHANGES.md
git add CHANGES.md
git commit -m "Add new manual steps in the throwaway branch" -q

git checkout main -q
mkdir -p .husky
cp "${EFCMS_ROOT}/.husky/post-merge" .husky/post-merge
chmod +x .husky/post-merge

printf "%bSimulating merge of 'throwaway' into 'main'...%b\n" "$GREEN" "$NC"
PRE_MERGE_HEAD=$(git rev-parse HEAD)
git merge throwaway --no-edit -q
git update-ref ORIG_HEAD "$PRE_MERGE_HEAD"

printf "%bExecuting post-merge hook...%b\n" "$GREEN" "$NC"
./.husky/post-merge
EXIT_CODE="$?"

if [ "$EXIT_CODE" -eq 0 ]; then
  printf "%bExited with status %s.%b\n" "$GREEN" "$EXIT_CODE" "$NC"
else
  ANY_ERROR=1
  printf "%bExited with status %s.%b\n" "$RED" "$EXIT_CODE" "$NC"
fi

[ "$ANY_ERROR" -eq 0 ] && printf "%bTest complete.%b\n" "$GREEN" "$NC" || printf "%bTest complete with error(s).%b\n" "$RED" "$NC"
