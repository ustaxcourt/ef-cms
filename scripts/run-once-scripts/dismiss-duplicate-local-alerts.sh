#!/usr/bin/env bash

# Dismisses the efcms-local Trivy alerts that duplicate ef-cms-us-east-1.
#
# Only alerts whose location is the image itself are dismissed. Alerts under real file
# paths come from the npm ci layer and are not duplicated in the base image reports.
#
# efcms-local is FROM ef-cms-us-east-1 plus COPY and npm ci, so it installs no OS
# packages and Trivy restated the base image's CVEs under a second image name.
# The scan was removed for #10412, but removing a scan does not close the alerts it
# already filed: no further analysis is uploaded for those categories, so they stay
# open until dismissed. The same CVEs remain tracked under the base image categories.
#
# Run this AFTER the severity-filter fix has landed on staging. The filter closes the
# below-threshold alerts on its own, which leaves far fewer to dismiss by hand.
#
# Usage
#   ./dismiss-duplicate-local-alerts.sh           # dry run; lists what would be dismissed
#   ./dismiss-duplicate-local-alerts.sh --apply   # performs the dismissals
#
# Requires the gh CLI, authenticated with write access to the repository.

set -euo pipefail

REPO="${REPO:-ustaxcourt/ef-cms}"
REF="${REF:-refs/heads/staging}"
CATEGORIES=("trivy-baseline-local" "trivy-image-local")
# Only the image rows duplicate the base image. Findings under real file paths come from
# the npm ci layer (app dependencies, the Cypress cache) and exist in no other category.
IMAGE_PATH_PREFIX="${IMAGE_PATH_PREFIX:-library/efcms-local}"
# GitHub accepts exactly: "false positive", "won't fix", "used in tests"
DEFAULT_DISMISS_REASON="won't fix"
DISMISS_REASON="${DISMISS_REASON:-$DEFAULT_DISMISS_REASON}"
DEFAULT_DISMISS_COMMENT="Duplicate scan target. efcms-local is FROM ef-cms-us-east-1 plus COPY and npm ci, so it installs no OS packages and Trivy reported the CVEs of the base image a second time under a different image name. The same CVEs remain tracked under trivy-baseline-base and trivy-image-base. The efcms-local scan was removed in the fix for #10412."
DISMISS_COMMENT="${DISMISS_COMMENT:-$DEFAULT_DISMISS_COMMENT}"

APPLY=false
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=true
elif [[ -n "${1:-}" ]]; then
  echo "unknown argument: $1" >&2
  echo "usage: $0 [--apply]" >&2
  exit 1
fi

if ! command -v gh > /dev/null; then
  echo "gh was not found on your path. Please install the GitHub CLI." >&2
  exit 1
fi

if ! command -v jq > /dev/null; then
  echo "jq was not found on your path. Please install jq." >&2
  exit 1
fi

if ! gh auth status > /dev/null 2>&1; then
  echo "gh is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

echo "Fetching open alerts for $REPO ($REF)..."
ALERTS_JSON="$(mktemp)"
trap 'rm -f "$ALERTS_JSON"' EXIT
gh api --paginate \
  "repos/${REPO}/code-scanning/alerts?state=open&ref=${REF}&per_page=100" \
  > "$ALERTS_JSON"

TOTAL_DISMISSED=0

for CATEGORY in "${CATEGORIES[@]}"; do
  NUMBERS=()
  while IFS= read -r NUMBER; do
    [[ -n "$NUMBER" ]] && NUMBERS+=("$NUMBER")
  done < <(jq -r --arg category "$CATEGORY" --arg prefix "$IMAGE_PATH_PREFIX" \
    '.[] | select(.most_recent_instance.category == $category)
         | select(.most_recent_instance.location.path | startswith($prefix))
         | .number' \
    "$ALERTS_JSON")

  SKIPPED="$(jq -r --arg category "$CATEGORY" --arg prefix "$IMAGE_PATH_PREFIX" \
    '[.[] | select(.most_recent_instance.category == $category)
          | select(.most_recent_instance.location.path | startswith($prefix) | not)] | length' \
    "$ALERTS_JSON")"

  echo ""
  echo "${CATEGORY}: ${#NUMBERS[@]} duplicate image alerts, ${SKIPPED} left alone (not duplicates)"

  if [[ "${#NUMBERS[@]}" -eq 0 ]]; then
    continue
  fi

  if [[ "$APPLY" != true ]]; then
    echo "  dry run; re-run with --apply to dismiss them"
    continue
  fi

  COUNT=0
  for NUMBER in "${NUMBERS[@]}"; do
    gh api -X PATCH "repos/${REPO}/code-scanning/alerts/${NUMBER}" \
      -f state=dismissed \
      -f dismissed_reason="$DISMISS_REASON" \
      -f dismissed_comment="$DISMISS_COMMENT" \
      > /dev/null
    COUNT=$((COUNT + 1))
    TOTAL_DISMISSED=$((TOTAL_DISMISSED + 1))
    if [[ $((COUNT % 100)) -eq 0 ]]; then
      echo "  dismissed ${COUNT}/${#NUMBERS[@]}"
    fi
    sleep 0.1
  done
  echo "  dismissed ${COUNT}/${#NUMBERS[@]}"
done

echo ""
if [[ "$APPLY" == true ]]; then
  echo "Done. Dismissed ${TOTAL_DISMISSED} alerts."
else
  echo "Dry run complete. No alerts were changed."
fi
