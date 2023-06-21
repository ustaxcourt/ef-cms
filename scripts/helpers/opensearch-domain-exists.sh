#!/bin/bash -e

function check_opensearch_domain_exists() {
  OPENSEARCH_DOMAIN=$1

  aws es describe-elasticsearch-domain --domain-name "${OPENSEARCH_DOMAIN}" --region us-east-1 > /dev/null 2>&1
  CODE=$?
  if [[ "${CODE}" == "0" ]]; then
    echo 1
  else
    echo 0
  fi
}
