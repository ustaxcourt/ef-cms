#!/bin/bash -e

# Wrapper script that automatically adds --trigger-minimal flag
exec "$(dirname "$0")/push-current-branch-to.sh" "$@" --trigger-minimal
