#!/bin/bash

# Returns the document buckets name to be used

# Usage
#   ./get-documents-bucket-name $EFCMS_DOMAIN $ENV

# Arguments
#   - $1 - the domain to use
#   - $2 - the env to use

[ -z "$1" ] && echo "The efcms domain must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The environment must be provided as the \$2 argument." && exit 1

DOMAIN=$1
ENVIRONMENT=$2

DOCUMENTS_BUCKET_NAME="${DOMAIN}-documents-${ENVIRONMENT}-us-east-1"
echo "${DOCUMENTS_BUCKET_NAME}"
