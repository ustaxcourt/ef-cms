#!/usr/bin/env bash

# Runs shellcheck over all .sh files in the project

# Usage
#   ./run-shellcheck.sh

( ! command -v shellcheck > /dev/null ) && echo "shellcheck was not found on your path. Please install shellcheck." && exit 1

EXIT_CODE=0
while IFS= read -r -d '' file; do
  # -S error  : only error-severity findings fail the build (warning/info/style reported but non-blocking)
  # -e SC1091 : suppress "unable to follow source" false positives (sourced env files not present at parse time)
  shellcheck -S error -e SC1091 "$file" || EXIT_CODE=1
 done < <(
   find . -type f -name '*.sh' \
     ! -path '*/node_modules/*' \
     ! -path '*/.terraform/*' \
     ! -path '*/dist/*' \
     ! -path '*/coverage/*' \
     -print0
 )

exit $EXIT_CODE
