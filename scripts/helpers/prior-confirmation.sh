#!/bin/bash -e

function has_prior_confirmation() {
  for param in "$@"; do
    if [[ "$param" == "--yes" ]] || [[ "$param" == "-y" ]]; then
      YES=1
    fi
  done
  [[ "$YES" -eq 1 ]] && echo 1 || echo 0
}
