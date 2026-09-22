#!/usr/bin/env bash

# Renders a SARIF report as a markdown table in the job summary and the workflow log.
# On runs that do not upload SARIF, this is the only place findings are visible.

set -euo pipefail

SARIF_FILE="${SARIF_FILE:?SARIF_FILE is required}"
SUMMARY_TITLE="${SUMMARY_TITLE:-SARIF results}"
MAX_RULES="${MAX_RULES:-25}"

if [ ! -f "$SARIF_FILE" ]; then
  echo "${SUMMARY_TITLE}: no SARIF report at ${SARIF_FILE}"
  exit 0
fi

TOTAL="$(jq '[.runs[]?.results[]?] | length' "$SARIF_FILE")"

LEVELS="$(jq -r '
  [.runs[]?.results[]? | (.level // "warning")]
  | group_by(.) | map("\(length) \(.[0])") | join(", ")
' "$SARIF_FILE")"

RULE_COUNT="$(jq '[.runs[]?.results[]? | (.ruleId // "(none)")] | unique | length' "$SARIF_FILE")"

TABLE="$(jq -r --argjson max "$MAX_RULES" '
  def clean: (. // "") | gsub("\n"; " ") | gsub("\\|"; "\\|") | .[0:90];

  ( [ .runs[]?.tool.driver.rules[]? ]
    | map({ key: .id, value: { desc: ((.shortDescription.text // .name // "") ) } })
    | from_entries
  ) as $rules
  | [ .runs[]?.results[]?
      | { ruleId: (.ruleId // "(none)"),
          level: (.level // "warning"),
          loc: ( (.locations[0]?.physicalLocation.artifactLocation.uri // "")
                 + ( if (.locations[0]?.physicalLocation.region.startLine // null) != null
                     then ":" + ((.locations[0].physicalLocation.region.startLine) | tostring)
                     else "" end ) ),
          desc: (($rules[(.ruleId // "")].desc // .message.text)) }
    ]
  | group_by(.ruleId)
  | map({ ruleId: .[0].ruleId, level: .[0].level, desc: .[0].desc, loc: .[0].loc, count: length })
  | sort_by(-.count)
  | .[0:$max]
  | .[]
  | "| \(.count) | \(.level) | \(.ruleId) | \(.desc | clean) | \(.loc | clean) |"
' "$SARIF_FILE")"

{
  echo "### ${SUMMARY_TITLE}"
  echo ""
  if [ "$TOTAL" -eq 0 ]; then
    echo "No findings."
  else
    echo "**${TOTAL} findings** across ${RULE_COUNT} rules (${LEVELS})."
    echo ""
    echo "| Count | Level | Rule | Description | Example location |"
    echo "| ----- | ----- | ---- | ----------- | ---------------- |"
    echo "$TABLE"
    if [ "$RULE_COUNT" -gt "$MAX_RULES" ]; then
      echo ""
      echo "_Showing the ${MAX_RULES} most frequent rules of ${RULE_COUNT}._"
    fi
  fi
  echo ""
} | tee -a "${GITHUB_STEP_SUMMARY:-/dev/null}"
