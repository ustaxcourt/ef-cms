#!/bin/bash -e

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

  *)
    echo "ERROR - Unknown Circle Branch: '${CIRCLE_BRANCH}'"
    exit 1
    ;;
esac

ENV=$ENV ./scripts/load-environment-from-secrets.sh

cp .env .env.sh
sed -i 's/^/export /g' .env.sh
cat .env.sh >> "${BASH_ENV}"

{
  echo "export CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh $ENV)"
  echo "export DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh $ENV)"
  echo "export DESTINATION_TABLE=$(./scripts/dynamo/get-destination-table.sh $ENV)"
  echo "export MIGRATE_FLAG=$(./scripts/dynamo/get-migrate-flag.sh $ENV)"
  echo "export SOURCE_TABLE=$(./scripts/dynamo/get-source-table.sh $ENV)"
  echo "export SOURCE_ELASTICSEARCH=$(./scripts/elasticsearch/get-source-elasticsearch.sh $ENV)"
  echo "export SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}"
  echo "export COMMIT_SHA=${CIRCLE_SHA1}"
} >> "${BASH_ENV}"
