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

for REGION in ${REGIONS[*]}
do
  BASE_PATH_MAPPING_RESTAPIID=$(aws apigateway get-base-path-mapping --domain-name "api-$DEPLOYING_COLOR.$EFCMS_DOMAIN" --base-path "(none)" --region $REGION | jq -r ".restApiId")
  if [[ -z "$BASE_PATH_MAPPING_RESTAPIID" ]] ; then
    echo "The non-public api-gateway mapping for api-$DEPLOYING_COLOR.$EFCMS_DOMAIN on $REGION was not found."
  else
    aws apigateway delete-base-path-mapping --domain-name "api-$DEPLOYING_COLOR.$EFCMS_DOMAIN" --base-path "(none)" --region $REGION
    echo "Deleted api gateway mapping for: api-$DEPLOYING_COLOR.$EFCMS_DOMAIN, $REGION with restApiId: $BASE_PATH_MAPPING_RESTAPIID"
  fi
done

for REGION in ${REGIONS[*]}
do
  PUBLIC_BASE_PATH_MAPPING_RESTAPIID=$(aws apigateway get-base-path-mapping --domain-name "public-api-$DEPLOYING_COLOR.$EFCMS_DOMAIN" --base-path "(none)" --region $REGION | jq -r ".restApiId")
  if [[ -z "$PUBLIC_BASE_PATH_MAPPING_RESTAPIID" ]] ; then
    echo "The public api-gateway mapping for public-api-$DEPLOYING_COLOR.$EFCMS_DOMAIN on $REGION was not found."
  else
    aws apigateway delete-base-path-mapping --domain-name "public-api-$DEPLOYING_COLOR.$EFCMS_DOMAIN" --base-path "(none)" --region $REGION
    echo "Deleted api gateway mapping for: public-api-$DEPLOYING_COLOR.$EFCMS_DOMAIN, $REGION with restApiId: $PUBLIC_BASE_PATH_MAPPING_RESTAPIID"
  fi
done
