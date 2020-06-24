#!/bin/bash

# Runs shellcheck over all .sh files in the project

# Usage
#   ./run-shellcheck.sh

# Requirements
#   - shellcheck must be installed on your machine

find . -type f -name '*.sh' ! -path '*node_modules*' -exec shellcheck {} \;
