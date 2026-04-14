#!/bin/bash -e

# Upgrades the OpenSearch engine version for the destination domain using the
# UpgradeDomain API, which performs an in-place upgrade that preserves all
# indices, aliases, and data.
#
# This script MUST run BEFORE terraform apply. The Terraform aws_opensearch_domain
# resource has a ForceNewIf on engine_version that can destroy and recreate the
# domain (losing all data) when GetCompatibleVersions does not list the target
# version as a valid upgrade path — which can happen on single-node clusters
# with older instance types like t2.small.search.
#
# By upgrading here first, the domain will already be at the target version when
# terraform runs, so terraform sees no engine_version change and does not trigger
# ForceNew.
#
# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

[ -z "$1" ] && echo "The ENV must be provided as the \$1 argument." && exit 1
[ -z "${ES_ENGINE_VERSION}" ] && echo "You must have ES_ENGINE_VERSION set in your environment" && exit 1

ENV=$1

DESTINATION_DOMAIN=$(./scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")

echo "Checking engine version for OpenSearch domain: ${DESTINATION_DOMAIN}"

# Get the current engine version of the domain
CURRENT_ENGINE_VERSION=$(aws opensearch describe-domain \
  --domain-name "${DESTINATION_DOMAIN}" \
  --region "us-east-1" \
  --query 'DomainStatus.EngineVersion' \
  --output text 2>/dev/null || echo "")

if [ -z "${CURRENT_ENGINE_VERSION}" ]; then
  echo "Domain ${DESTINATION_DOMAIN} does not exist yet; skipping engine version upgrade (terraform will create it)."
  exit 0
fi

echo "  Current engine version: ${CURRENT_ENGINE_VERSION}"
echo "  Target engine version:  ${ES_ENGINE_VERSION}"

if [ "${CURRENT_ENGINE_VERSION}" == "${ES_ENGINE_VERSION}" ]; then
  echo "Domain is already at the target engine version. No upgrade needed."
  exit 0
fi

echo "Upgrading OpenSearch domain ${DESTINATION_DOMAIN} from ${CURRENT_ENGINE_VERSION} to ${ES_ENGINE_VERSION}..."

# Call UpgradeDomain API directly — this always performs an in-place upgrade
aws opensearch upgrade-domain \
  --domain-name "${DESTINATION_DOMAIN}" \
  --target-version "${ES_ENGINE_VERSION}" \
  --region "us-east-1"

echo "Upgrade initiated. Waiting for the domain to finish upgrading..."

# Poll until the domain is no longer processing
CHECK_INTERVAL=30
MAX_RETRIES=120  # 120 * 30s = 60 minutes max wait
CURRENT_TRY=0

while [ $CURRENT_TRY -lt $MAX_RETRIES ]; do
  PROCESSING=$(aws opensearch describe-domain \
    --domain-name "${DESTINATION_DOMAIN}" \
    --region "us-east-1" \
    --query 'DomainStatus.Processing' \
    --output text 2>/dev/null || echo "True")

  UPGRADE_PROCESSING=$(aws opensearch describe-domain \
    --domain-name "${DESTINATION_DOMAIN}" \
    --region "us-east-1" \
    --query 'DomainStatus.UpgradeProcessing' \
    --output text 2>/dev/null || echo "True")

  if [ "${PROCESSING}" == "False" ] && [ "${UPGRADE_PROCESSING}" == "False" ]; then
    echo "Domain upgrade complete."

    # Verify the engine version
    NEW_ENGINE_VERSION=$(aws opensearch describe-domain \
      --domain-name "${DESTINATION_DOMAIN}" \
      --region "us-east-1" \
      --query 'DomainStatus.EngineVersion' \
      --output text)

    echo "  Verified engine version: ${NEW_ENGINE_VERSION}"

    if [ "${NEW_ENGINE_VERSION}" != "${ES_ENGINE_VERSION}" ]; then
      echo "WARNING: Engine version after upgrade (${NEW_ENGINE_VERSION}) does not match target (${ES_ENGINE_VERSION})."
      echo "This may indicate the upgrade was only partially applied. Proceeding anyway."
    fi

    exit 0
  fi

  echo "  Domain still processing (Processing=${PROCESSING}, UpgradeProcessing=${UPGRADE_PROCESSING}). Checking again in ${CHECK_INTERVAL}s... (attempt $((CURRENT_TRY + 1))/${MAX_RETRIES})"
  ((CURRENT_TRY=CURRENT_TRY+1))
  sleep $CHECK_INTERVAL
done

echo "ERROR: Timed out waiting for the OpenSearch domain upgrade to complete."
echo "The upgrade may still be in progress. Check the AWS console for status."
exit 1
