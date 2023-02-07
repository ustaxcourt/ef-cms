#!/bin/bash

# Deletes the specified elasticsearch domain for the environment

# Usage
#   ./delete-elasticsearch-cluster.sh $DOMAIN_NAME

# Arguments
#   - $1 - the domain to delete

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The cluster to delete must be provided as the \$1 argument." && exit 1

DOMAIN_NAME=$1
REQUEST_TO_DELETE_DOMAIN=$(aws es delete-elasticsearch-domain --domain "${DOMAIN_NAME}" --region us-east-1 | jq -r ".DomainStatus.Deleted")

if [[ $REQUEST_TO_DELETE_DOMAIN == false ]] ; then
  echo "The request to delete domain ${DOMAIN_NAME} failed."
  exit 1
else
  echo "The request to delete domain ${DOMAIN_NAME} was successful."
fi

# Set the interval at which to check the status of the domain (in seconds)
CHECK_INTERVAL=30
# 50 retries is 25 minutes at this interval 
MAX_RETRIES=50
CURRENT_TRY=0

# Keep checking the status of the domain until it has been confirmed to be deleted
while [ $CURRENT_TRY -le $MAX_RETRIES ] 
do
  DOMAIN_EXISTS=$(aws es describe-elasticsearch-domain --region us-east-1 --domain-name "$DOMAIN_NAME" 2>&1)

  if [[ $DOMAIN_EXISTS == *"ResourceNotFoundException"* ]]; then
    echo "The Elasticsearch domain has been deleted."
    break
  else
    echo "The Elasticsearch domain still exists. Checking again in $CHECK_INTERVAL seconds..."
    ((CURRENT_TRY=CURRENT_TRY+1))
    sleep $CHECK_INTERVAL
  fi
done

echo "Script completed"
