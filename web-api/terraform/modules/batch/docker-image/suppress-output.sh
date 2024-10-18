#!/bin/bash -e

function should_suppress_output() {
  for param in "$@"; do
    if [[ "$param" == "--quiet" ]] || [[ "$param" == "-q" ]]; then
      QUIET=1
    fi
  done
  [[ "$QUIET" -eq 1 ]] && echo 1 || echo 0
}
