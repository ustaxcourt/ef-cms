#!/bin/bash

# creates the entry for the AWS BATCH Zipper flag count in the dynamo deploy table

# Usage
#   ENV=dev ./setup-aws-batch-zipper-minimum-count-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "aws-batch-zipper-minimum-count"
    },
    "sk":{
        "S": "aws-batch-zipper-minimum-count"
    },
    "current": {
        "N": 0
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"