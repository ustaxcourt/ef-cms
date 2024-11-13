#!/bin/bash -e

function should_suppress_output() {
  for param in "$@"; do
    { [[ "$param" == "--quiet" ]] || [[ "$param" == "-q" ]]; } && QUIET=1
  done
  [[ "$QUIET" -eq 1 ]] && echo 1 || echo 0
}
