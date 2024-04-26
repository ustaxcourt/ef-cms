#!/bin/bash

# Deletes the specified api gateway mappings from the environment, for public and non-public.
# Note: 
# Since this is run after switch-colors, we delete the color that is not current (deploying)
# because this is the old/source color prior to the color switch.

# Usage
#   ./delete-api-gateway-mappings.sh $EFCMS_DOMAIN $DEPLOYING_COLOR

# Arguments
#   - $1 - the EFCMS_DOMAIN api-gateway mappings to delete
#   - $2 - the color api-gateway mappings to delete

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The EFCMS_DOMAIN of the mapping to delete must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The DEPLOYING_COLOR of the mapping to delete must be provided as the \$2 argument." && exit 1

EFCMS_DOMAIN=$1
DEPLOYING_COLOR=$2 

REGIONS=("us-east-1" "us-west-1")
PREFIXES=("public-api" "api")

for REGION in "${REGIONS[@]}"
do
  REST_APIS=$(aws apigateway get-rest-apis --page-size 500 --region "$REGION" | jq -r '.items[]' )

  for PREFIX in "${PREFIXES[@]}"
  do
    DOMAIN_NAME="${PREFIX}-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
    [[ $PREFIX == "public-api" ]] && GATEWAY_NAME="gateway_api_public_${ENV}_${DEPLOYING_COLOR}" || GATEWAY_NAME="gateway_api_${ENV}_${DEPLOYING_COLOR}"

    # check to see if it exists... it shouldn't exist because we deleted it.
    BASE_PATH_MAPPING_RESTAPIID=$(aws apigateway get-base-path-mapping --domain-name "$DOMAIN_NAME" --base-path "(none)" --region "$REGION" 2>/dev/null | jq -r ".restApiId")
    
    # echo $BASE_PATH_MAPPING_RESTAPIID

    if [[ -z "$BASE_PATH_MAPPING_RESTAPIID" ]] ; then

      REST_API_ID=$(echo "$REST_APIS" | jq -r "select(.name | match(\"$GATEWAY_NAME\")) | .id")

      echo "The api-gateway mapping for ${DOMAIN_NAME} on ${REGION} was not found. Reintroducing"

      aws apigateway create-base-path-mapping --domain-name "$DOMAIN_NAME" --rest-api-id "$REST_API_ID" --stage "$ENV" --region "$REGION"

    else
      echo "The gateway mapping was found for: ${DOMAIN_NAME}, ${REGION} with restApiId: ${BASE_PATH_MAPPING_RESTAPIID}"
    fi
  done
done
