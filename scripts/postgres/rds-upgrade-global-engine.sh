#!/usr/bin/env bash

set -euo pipefail

# One-off helper to upgrade Aurora PostgreSQL engine version for the
# Global Database members: upgrades the secondary first, then the primary.
#
# Defaults are derived from Terraform naming in web-api/terraform/modules/rds/rds.tf:
#   - Primary cluster identifier: "${ENV}-dawson-cluster"
#   - Secondary cluster identifier (us-west-1): "${ENV}-dawson-replica"
#   - Global cluster is not modified directly here.
#
# Usage examples:
#   source scripts/env/environments/ustc-dev.env
#   ./scripts/rds-upgrade-global-engine.sh --target-version 14.10
#
# Or without sourcing an env file:
#   ./scripts/rds-upgrade-global-engine.sh --env dev --target-version 14.10 \
#     --primary-region us-east-1 --secondary-region us-west-1

PRIMARY_REGION_DEFAULT=${AWS_REGION:-${AWS_DEFAULT_REGION:-"us-east-1"}}
SECONDARY_REGION_DEFAULT="us-west-1"

ENVIRONMENT=${ENV:-""}
TARGET_VERSION=""
PRIMARY_REGION="$PRIMARY_REGION_DEFAULT"
SECONDARY_REGION="$SECONDARY_REGION_DEFAULT"
ASSUME_YES=false

function usage() {
  cat <<EOF
Usage: $0 --target-version <engine-version> [--env <env>] [--primary-region <region>] [--secondary-region <region>] [--yes]

Required:
  --target-version     Target Aurora PostgreSQL engine version (e.g., 14.10)

Optional:
  --env                Environment name; used to build cluster identifiers (default: ENV env var)
  --primary-region     AWS region for primary cluster (default: ${PRIMARY_REGION_DEFAULT})
  --secondary-region   AWS region for secondary cluster (default: ${SECONDARY_REGION_DEFAULT})
  --yes                Do not prompt for confirmation

Notes:
  - Cluster identifiers are assumed to be "<env>-dawson-cluster" (primary) and "<env>-dawson-replica" (secondary), per rds.tf.
  - This script upgrades the secondary first, then the primary, and waits for availability between steps.
  - It will set --allow-major-version-upgrade automatically if moving across major versions.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--target-version)
      TARGET_VERSION="$2"; shift 2 ;;
    -e|--env)
      ENVIRONMENT="$2"; shift 2 ;;
    -p|--primary-region)
      PRIMARY_REGION="$2"; shift 2 ;;
    -s|--secondary-region)
      SECONDARY_REGION="$2"; shift 2 ;;
    -y|--yes)
      ASSUME_YES=true; shift 1 ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$TARGET_VERSION" ]]; then
  echo "ERROR: --target-version is required" >&2
  usage; exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: aws CLI not found in PATH" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required (install with: brew install jq)" >&2
  exit 1
fi

if [[ -z "$ENVIRONMENT" ]]; then
  echo "ERROR: ENV not set and --env not provided" >&2
  usage; exit 1
fi

PRIMARY_CLUSTER_ID="${ENVIRONMENT}-dawson-cluster"
SECONDARY_CLUSTER_ID="${ENVIRONMENT}-dawson-replica"

echo "Environment       : $ENVIRONMENT"
echo "Target engine ver : $TARGET_VERSION"
echo "Primary region    : $PRIMARY_REGION"
echo "Secondary region  : $SECONDARY_REGION"
echo "Primary cluster   : $PRIMARY_CLUSTER_ID"
echo "Secondary cluster : $SECONDARY_CLUSTER_ID"

function get_engine_version() {
  local cluster_id="$1"
  local region="$2"
  aws rds describe-db-clusters \
    --db-cluster-identifier "$cluster_id" \
    --region "$region" \
    --query 'DBClusters[0].EngineVersion' \
    --output text
}

function get_engine() {
  local cluster_id="$1"
  local region="$2"
  aws rds describe-db-clusters \
    --db-cluster-identifier "$cluster_id" \
    --region "$2" \
    --query 'DBClusters[0].Engine' \
    --output text
}

function list_valid_targets_versions() {
  # Prints newline-separated EngineVersion values that are valid upgrade targets
  local current_ver="$1"; local region="$2"
  aws rds describe-db-engine-versions \
    --engine aurora-postgresql \
    --engine-version "$current_ver" \
    --region "$region" \
    --query 'DBEngineVersions[0].ValidUpgradeTarget[].EngineVersion' \
    --output text | tr '\t' '\n' | sed '/^$/d'
}

function print_valid_targets_table() {
  local current_ver="$1"; local region="$2"; local label="$3"
  echo "\nValid upgrade targets for $label (region $region, from $current_ver):"
  aws rds describe-db-engine-versions \
    --engine aurora-postgresql \
    --engine-version "$current_ver" \
    --region "$region" \
    --query 'DBEngineVersions[0].ValidUpgradeTarget[].{Version:EngineVersion,Major:IsMajorVersionUpgrade}' \
    --output table || echo "(none)"
}

function contains_version() {
  local needle="$1"; shift
  for v in "$@"; do
    if [[ "$v" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

function major_of() {
  # Extract leading integer (major version)
  local ver="$1"
  echo "$ver" | grep -oE '^[0-9]+'
}

function is_major_upgrade() {
  local from_ver="$1"; local to_ver="$2"
  local from_major; from_major=$(major_of "$from_ver")
  local to_major; to_major=$(major_of "$to_ver")
  if [[ -z "$from_major" || -z "$to_major" ]]; then
    echo "false"; return 0
  fi
  if [[ "$from_major" != "$to_major" ]]; then
    echo "true"; return 0
  fi
  echo "false"
}

function cluster_exists() {
  local cluster_id="$1"; local region="$2"
  set +e
  aws rds describe-db-clusters --db-cluster-identifier "$cluster_id" --region "$region" >/dev/null 2>&1
  local ec=$?
  set -e
  return $ec
}

function modify_cluster() {
  local cluster_id="$1"; local region="$2"; local target="$3"; local allow_major="$4"
  local args=(
    rds modify-db-cluster
    --db-cluster-identifier "$cluster_id"
    --engine-version "$target"
    --apply-immediately
    --region "$region"
  )
  if [[ "$allow_major" == "true" ]]; then
    args+=(--allow-major-version-upgrade)
  fi
  echo "Running: aws ${args[*]}"
  aws "${args[@]}" >/dev/null
}

function wait_available() {
  local cluster_id="$1"; local region="$2"
  echo "Waiting for cluster '$cluster_id' in $region to become available..."
  aws rds wait db-cluster-available --db-cluster-identifier "$cluster_id" --region "$region"
}

function wait_engine_version() {
  # Wait until a cluster reports the desired EngineVersion (with timeout)
  local cluster_id="$1"; local region="$2"; local desired="$3"; local timeout_sec="${4:-3600}"
  local start_ts; start_ts=$(date +%s)
  local current
  while true; do
    current=$(get_engine_version "$cluster_id" "$region") || current=""
    if [[ "$current" == "$desired" ]]; then
      echo "Cluster '$cluster_id' in $region now on EngineVersion $current"
      return 0
    fi
    local now; now=$(date +%s)
    local elapsed=$(( now - start_ts ))
    if (( elapsed > timeout_sec )); then
      echo "ERROR: Timed out waiting for '$cluster_id' in $region to reach EngineVersion '$desired' (last seen: '$current')" >&2
      return 1
    fi
    echo "Waiting for engine version '$desired' on '$cluster_id' (current: '$current')..."
    sleep 20
  done
}

echo "\nValidating clusters exist..."
if ! cluster_exists "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION"; then
  echo "ERROR: Secondary cluster '$SECONDARY_CLUSTER_ID' not found in region $SECONDARY_REGION" >&2
  exit 1
fi
if ! cluster_exists "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION"; then
  echo "ERROR: Primary cluster '$PRIMARY_CLUSTER_ID' not found in region $PRIMARY_REGION" >&2
  exit 1
fi

sec_engine=$(get_engine "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION")
pri_engine=$(get_engine "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION")
if [[ "$sec_engine" != "aurora-postgresql" || "$pri_engine" != "aurora-postgresql" ]]; then
  echo "ERROR: Unexpected engine(s). Secondary=$sec_engine Primary=$pri_engine (expected aurora-postgresql)" >&2
  exit 1
fi

current_secondary_ver=$(get_engine_version "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION")
current_primary_ver=$(get_engine_version "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION")

echo "Secondary current : $current_secondary_ver"
echo "Primary current   : $current_primary_ver"

# Show valid targets and validate requested version is supported in both regions
print_valid_targets_table "$current_secondary_ver" "$SECONDARY_REGION" "SECONDARY"
print_valid_targets_table "$current_primary_ver" "$PRIMARY_REGION" "PRIMARY"

# Determine if clusters are already on the requested target version
secondary_already=false
primary_already=false
if [[ "$current_secondary_ver" == "$TARGET_VERSION" ]]; then
  secondary_already=true
fi
if [[ "$current_primary_ver" == "$TARGET_VERSION" ]]; then
  primary_already=true
fi

# Build arrays of valid targets without using mapfile (for macOS bash 3.x compatibility)
OLDIFS=$IFS
IFS=$'\n'
secondary_targets=( $(list_valid_targets_versions "$current_secondary_ver" "$SECONDARY_REGION") )
primary_targets=( $(list_valid_targets_versions "$current_primary_ver" "$PRIMARY_REGION") )
IFS=$OLDIFS

if [[ "$secondary_already" != true ]] && ! contains_version "$TARGET_VERSION" "${secondary_targets[@]}"; then
  echo "\nERROR: Target version '$TARGET_VERSION' is not a valid upgrade target for SECONDARY in $SECONDARY_REGION from $current_secondary_ver" >&2
  echo "Choose one of:" >&2
  printf '  - %s\n' "${secondary_targets[@]}" >&2
  exit 1
fi

if [[ "$primary_already" != true ]] && ! contains_version "$TARGET_VERSION" "${primary_targets[@]}"; then
  echo "\nERROR: Target version '$TARGET_VERSION' is not a valid upgrade target for PRIMARY in $PRIMARY_REGION from $current_primary_ver" >&2
  echo "Choose one of:" >&2
  printf '  - %s\n' "${primary_targets[@]}" >&2
  exit 1
fi

# If both clusters already match the target, nothing to do
if [[ "$secondary_already" == true && "$primary_already" == true ]]; then
  echo "\nBoth clusters are already on $TARGET_VERSION. Nothing to do."
  exit 0
fi

if [[ "$ASSUME_YES" != true ]]; then
  read -r -p $'\nProceed with upgrade (secondary -> primary)? [y/N] ' resp
  if [[ ! "$resp" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

sec_major=$(is_major_upgrade "$current_secondary_ver" "$TARGET_VERSION")
pri_major=$(is_major_upgrade "$current_primary_ver" "$TARGET_VERSION")

if [[ "$secondary_already" == true ]]; then
  echo "\nSECONDARY ($SECONDARY_CLUSTER_ID) already on $TARGET_VERSION; skipping."
else
  echo "\nUpgrading SECONDARY ($SECONDARY_CLUSTER_ID) in $SECONDARY_REGION to $TARGET_VERSION (major=$sec_major)"
  modify_cluster "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION" "$TARGET_VERSION" "$sec_major"
  wait_available "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION"
  wait_engine_version "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION" "$TARGET_VERSION" 5400
  echo "Secondary upgrade complete."
fi

if [[ "$primary_already" == true ]]; then
  echo "\nPRIMARY ($PRIMARY_CLUSTER_ID) already on $TARGET_VERSION; skipping."
else
  echo "\nUpgrading PRIMARY ($PRIMARY_CLUSTER_ID) in $PRIMARY_REGION to $TARGET_VERSION (major=$pri_major)"
  modify_cluster "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION" "$TARGET_VERSION" "$pri_major"
  wait_available "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION"
  wait_engine_version "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION" "$TARGET_VERSION" 5400
  echo "Primary upgrade complete."
fi

echo "\nVerifying final versions..."
final_secondary_ver=$(get_engine_version "$SECONDARY_CLUSTER_ID" "$SECONDARY_REGION")
final_primary_ver=$(get_engine_version "$PRIMARY_CLUSTER_ID" "$PRIMARY_REGION")
echo "Secondary final : $final_secondary_ver"
echo "Primary final   : $final_primary_ver"

if [[ "$final_secondary_ver" == "$TARGET_VERSION" && "$final_primary_ver" == "$TARGET_VERSION" ]]; then
  echo "SUCCESS: Both clusters are now on $TARGET_VERSION"
else
  echo "WARNING: Version mismatch detected after upgrade." >&2
  exit 2
fi


