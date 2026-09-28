#!/usr/bin/env bash

# Renders a SARIF report as a findings list in the job summary and the workflow log.
# On runs that do not upload SARIF, this is the only place findings are visible.

set -euo pipefail

SARIF_FILE="${SARIF_FILE:?SARIF_FILE is required}"
SUMMARY_TITLE="${SUMMARY_TITLE:-SARIF results}"
MAX_FINDINGS="${MAX_FINDINGS:-100}"
MAX_RULES="${MAX_RULES:-25}"

if [ ! -f "$SARIF_FILE" ]; then
  echo "${SUMMARY_TITLE}: no SARIF report at ${SARIF_FILE}"
  exit 0
fi

# One record per finding, most severe first. Semgrep sets the level on the rule rather
# than the result, and Trivy reports a region of 1:1 for findings that have no line.
FINDINGS="$(jq -c '
  def trimmed: (. // "") | sub("^\\s+"; "") | sub("\\s+$"; "");
  def rank: {"error": 0, "warning": 1, "note": 2}[.] // 3;

  [ .runs[]?
    | ( [ .tool.driver.rules[]? ] | map({ key: .id, value: . }) | from_entries ) as $rules
    | .results[]?
    | ($rules[.ruleId // ""] // {}) as $rule
    | (.locations[0]?.physicalLocation // {}) as $where
    | ($where.region // {}) as $region
    | ($rule.shortDescription.text // "") as $title
    | { ruleId: (.ruleId // "(none)"),
        level: (.level // $rule.defaultConfiguration.level // "warning"),
        severity: (($rule.properties["security-severity"] // "0") | tonumber? // 0),
        uri: ($where.artifactLocation.uri // "(unknown location)"),
        line: (if ($region.startLine // null) == null
                  or (($region.startLine // 1) == 1 and ($region.endLine // 1) == 1
                      and ($region.startColumn // 1) == 1 and ($region.endColumn // 1) == 1)
               then null else $region.startLine end),
        title: (if ($title | startswith("Semgrep Finding:")) then "" else ($title | trimmed) end),
        message: ((.message.text // "")
                  | trimmed
                  | split("\n")
                  | map(select(startswith("Vulnerability ") | not) | trimmed)
                  | map(select(. != ""))
                  | join(" · ")),
        snippet: (($region.snippet.text // "") | trimmed | split("\n")[0] // "" | .[0:120]) }
  ]
  | sort_by([(.level | rank), -.severity, .ruleId, .uri, (.line // 0)])
  | .[]
' "$SARIF_FILE")"

TOTAL="$(printf '%s' "$FINDINGS" | jq -s 'length')"

{
  echo "### ${SUMMARY_TITLE}"
  echo ""
  if [ "$TOTAL" -eq 0 ]; then
    echo "No findings."
  else
    RULE_COUNT="$(printf '%s\n' "$FINDINGS" | jq -s '[.[].ruleId] | unique | length')"
    LEVELS="$(printf '%s\n' "$FINDINGS" | jq -rs 'group_by(.level) | sort_by(.[0].level | {"error": 0, "warning": 1, "note": 2}[.] // 3) | map("\(length) \(.[0].level)") | join(", ")')"
    echo "**${TOTAL} findings** across ${RULE_COUNT} rules (${LEVELS})."
    echo ""
    printf '%s\n' "$FINDINGS" | head -n "$MAX_FINDINGS" | jq -r '
      def code: if contains("`") then "`` " + . + " ``" else "`" + . + "`" end;
      "- **\(.level)** `\(.ruleId)` in `\(.uri)\(if .line then ":\(.line)" else "" end)`",
      ( if .title != "" then "  - \(.title)" else empty end ),
      ( if .message != "" and .message != .title then "  - \(.message)" else empty end ),
      ( if .snippet != "" then "  - \(.snippet | code)" else empty end )
    '
    if [ "$TOTAL" -gt "$MAX_FINDINGS" ]; then
      echo ""
      echo "_Showing the ${MAX_FINDINGS} most severe of ${TOTAL} findings. Rules by count:_"
      echo ""
      echo "| Count | Rule | Description |"
      echo "| ----- | ---- | ----------- |"
      printf '%s\n' "$FINDINGS" | jq -rs --argjson max "$MAX_RULES" '
        def clean: gsub("\\|"; "\\|") | .[0:90];
        group_by(.ruleId)
        | map({ ruleId: .[0].ruleId, count: length, desc: .[0].title })
        | sort_by(-.count)
        | .[0:$max][]
        | "| \(.count) | \(.ruleId) | \(.desc | clean) |"'
    fi
  fi
  echo ""
} | tee -a "${GITHUB_STEP_SUMMARY:-/dev/null}"
