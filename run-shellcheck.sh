#!/bin/bash

# Runs shellcheck over all .sh files in the project

# Usage
#   ./run-shellcheck.sh

( ! command -v shellcheck > /dev/null ) && echo "shellcheck was not found on your path. Please install shellcheck." && exit 1

find . -type f -name '*.sh' ! -path '*node_modules*' -exec shellcheck {} \;
