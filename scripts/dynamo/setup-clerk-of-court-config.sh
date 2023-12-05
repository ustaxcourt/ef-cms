#!/bin/bash

# Sets the title and name of the clerk of the court

# Usage
#   ENV=dev ./setup-clerk-of-court-config.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

ITEM=$(cat <<-END
{
    "pk": {
        "S": "clerk-of-court-configuration"
    },
    "sk":{
        "S": "clerk-of-court-configuration"
    },
    "current": {
        "M": {"name": {"S": "Stephanie A. Servoss"}, "title": {"S": "Clerk of the Court"}} 
    }
}
END
)

aws dynamodb put-item \
    --region us-east-1 \
    --table-name "efcms-deploy-${ENV}" \
    --item "${ITEM}"
