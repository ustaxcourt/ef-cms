#!/bin/bash -e

find . -type f -name '*.sh' ! -path '*node_modules*' -exec shellcheck {} \;
