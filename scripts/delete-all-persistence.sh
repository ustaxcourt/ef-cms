#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY"

[[ "$ENV" == "prod" ]] && echo "This script is for lower environments only" && exit 1

# shellcheck disable=SC1091
source ./scripts/helpers/opensearch-domain-exists.sh

VERSIONS="alpha beta"

for ver in $VERSIONS; do
  DYNAMODB_TABLE="efcms-${ENV}-${ver}"
  OPENSEARCH_DOMAIN="efcms-search-${ENV}-${ver}"

  ./scripts/dynamo/delete-dynamo-table.sh "$DYNAMODB_TABLE"

  EXISTS=$(check_opensearch_domain_exists "$OPENSEARCH_DOMAIN")
  if [[ "$EXISTS" == "1" ]]; then
    aws es delete-elasticsearch-domain --domain-name "$OPENSEARCH_DOMAIN" --region us-east-1
    while [[ "$EXISTS" == "1" ]]; do
      echo "${OPENSEARCH_DOMAIN} is still being deleted. Waiting 30 seconds then checking again."
      sleep 30
      EXISTS=$(check_opensearch_domain_exists "$OPENSEARCH_DOMAIN")
    done
  fi
  echo "${OPENSEARCH_DOMAIN} in region us-east-1 is deleted."
done
