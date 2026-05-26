#!/usr/bin/env bash
set -e

# 1. set ENV
case $CIRCLE_BRANCH in

  develop)
    ENV="dev"
    ;;

  irs)
    ENV="irs"
    ;;

  prod)
    ENV="prod"
    ;;

  migration)
    ENV="mig"
    ;;

  test)
    ENV="test"
    ;;

  staging)
    ENV="stg"
    ;;

  experimental1)
    ENV="exp1"
    ;;

  experimental2)
    ENV="exp2"
    ;;

  experimental3)
    ENV="exp3"
    ;;

  experimental4)
    ENV="exp4"
    ;;

  experimental5)
    ENV="exp5"
    ;;

  experimental6)
    ENV="exp6"
    ;;

  experimental7)
    ENV="exp7"
    ;;

  experimental8)
    ENV="exp8"
    ;;

  experimental9)
    ENV="exp9"
    ;;

  *)
    echo "ERROR - Unknown Circle Branch: '${CIRCLE_BRANCH}'"
    exit 1
    ;;
esac

export ENV="$ENV"
./scripts/load-environment-from-secrets.sh

cp .env .env.sh
sed -i 's/^/export /g' .env.sh
cat .env.sh >> "${BASH_ENV}"

REGION=us-east-1
USER_POOL_ID=$(aws cognito-idp list-user-pools \
  --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" \
  --max-results 30 \
  --region "$REGION" \
  --output text)
COGNITO_CLIENT_ID=$(aws cognito-idp list-user-pool-clients \
  --user-pool-id "$USER_POOL_ID" \
  --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" \
  --max-results 30 \
  --region "$REGION" \
  --output text)
USER_POOL_IRS_ID=$(aws cognito-idp list-user-pools \
  --query "UserPools[?Name == 'efcms-irs-${ENV}'].Id | [0]" \
  --max-results 30 \
  --region "$REGION" \
  --output text)
SOURCE_TABLE=$(./scripts/ssm/get-source-table.sh $ENV)

{
  echo "export AWS_REGION=${REGION}"
  echo "export COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID}"
  echo "export CURRENT_COLOR=$(./scripts/ssm/get-current-color.sh $ENV)"
  echo "export DEPLOYING_COLOR=$(./scripts/ssm/get-deploying-color.sh $ENV)"
  echo "export DESTINATION_TABLE=$(./scripts/ssm/get-destination-table.sh $ENV)"
  echo "export MIGRATE_FLAG=$(./scripts/migration/get-migrate-flag.sh $ENV)"
  echo "export POSTGRES_HOST=$(./scripts/postgres/get-host.sh -w -h)"
  echo "export REGION=${REGION}"
  echo "export SOURCE_ELASTICSEARCH=$(./scripts/elasticsearch/get-source-elasticsearch.sh $ENV)"
  echo "export SOURCE_TABLE=${SOURCE_TABLE}"
  echo "export STAGE=${ENV}"
  echo "export USER_POOL_ID=${USER_POOL_ID}"
  echo "export USER_POOL_IRS_ID=${USER_POOL_IRS_ID}"
} >> "${BASH_ENV}"
