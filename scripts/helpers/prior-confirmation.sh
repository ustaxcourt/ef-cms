#!/bin/bash -e

function has_prior_confirmation() {
  for param in "$@"; do
    { [[ "$param" == "--yes" ]] || [[ "$param" == "-y" ]]; } && YES=1
  done
  [[ "$YES" -eq 1 ]] && echo 1 || echo 0
}
