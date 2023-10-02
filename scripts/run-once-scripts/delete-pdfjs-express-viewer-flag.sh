#!/bin/bash -e

# Deletes the pdfjs-express-viewer-enabled flag

# Usage
#   ENV=dev ./scripts/run-once-scripts/delete-pdfjs-express-viewer-flag.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws dynamodb delete-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"pdfjs-express-viewer-enabled"},"sk":{"S":"pdfjs-express-viewer-enabled"}}'

