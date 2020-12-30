#!/bin/bash -e

#
# This is a temporary script used to add the custom attribute `userId` to our cognito
# user pools without deleting and recreating them. 
#
# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV=$1
REGION="us-east-1"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

aws cognito-idp --region "${REGION}" add-custom-attributes --user-pool-id "${USER_POOL_ID}" --custom-attributes Name="userId",AttributeDataType=String,Mutable=true,Required=false,StringAttributeConstraints="{MinLength=0,MaxLength=255}"

npm run init:api -- "${ENV}"

pushd ./web-api/terraform/main
  terraform state rm module.ef-cms_apis.aws_cognito_user_pool.pool

  terraform import module.ef-cms_apis.aws_cognito_user_pool.pool "${USER_POOL_ID}"
popd 