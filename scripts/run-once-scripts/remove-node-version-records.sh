#!/bin/bash -e

# Removes the node version records in the target environment's deploy table

# Usage
#   ENV=dev ./remove-node-version-records.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"current-node-version"},"sk":{"S":"current-node-version"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"deploying-node-version"},"sk":{"S":"deploying-node-version"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"deploying-use-layers"},"sk":{"S":"deploying-use-layers"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"current-use-layers"},"sk":{"S":"current-use-layers"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"use-external-pdf-generation"},"sk":{"S":"use-external-pdf-generation"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"pdfjs-express-viewer-enabled"},"sk":{"S":"pdfjs-express-viewer-enabled"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"multi-docketable-paper-filings"},"sk":{"S":"multi-docketable-paper-filings"}}'

aws dynamodb delete-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"consolidated-cases-add-docket-numbers"},"sk":{"S":"consolidated-cases-add-docket-numbers"}}'