#!/bin/bash -e

./check-env-variables.sh \
  "ENV" \
  "REGION" \
  "AWS_ACCOUNT_ID" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "RDS_ENGINE_VERSION"

TARGET_VERSION="$RDS_ENGINE_VERSION"
DB_CLUSTER_IDENTIFIER="${ENV}-dawson-cluster"

CURRENT_RDS_ENGINE_VERSION=$(aws rds describe-db-clusters \
  --db-cluster-identifier "$DB_CLUSTER_IDENTIFIER" \
  --query "DBClusters[0].EngineVersion" \
  --region "$REGION" \
  --output text || echo "")

if [ -z "$CURRENT_RDS_ENGINE_VERSION" ]; then
  echo "Could not find RDS cluster ${DB_CLUSTER_IDENTIFIER}."
  exit 1
fi

if [ "$CURRENT_RDS_ENGINE_VERSION" == "$TARGET_VERSION" ]; then
  echo "Database is already at engine version ${TARGET_VERSION}. Skipping upgrade."
  exit 0
fi

echo "Current DB Version: ${CURRENT_RDS_ENGINE_VERSION}"
echo "Target DB Version: ${TARGET_VERSION}"
echo "Initiating Blue/Green Deployment for ${DB_CLUSTER_IDENTIFIER}..."

SOURCE_ARN=$(aws rds describe-db-clusters \
  --db-cluster-identifier "$DB_CLUSTER_IDENTIFIER" \
  --query "DBClusters[0].DBClusterArn" \
  --region "$REGION" \
  --output text)

BG_NAME="${ENV}-bg-upgrade-$(date +%s)"

echo "Creating Blue/Green deployment: ${BG_NAME}"
BG_RESPONSE=$(aws rds create-blue-green-deployment \
  --blue-green-deployment-name "$BG_NAME" \
  --source "$SOURCE_ARN" \
  --target-engine-version "$TARGET_VERSION" \
  --region "$REGION" \
  --output json)

BG_IDENTIFIER=$(echo "$BG_RESPONSE" | jq -r '.BlueGreenDeploymentIdentifier')

if [ -z "$BG_IDENTIFIER" ] || [ "$BG_IDENTIFIER" == "null" ]; then
  echo "Failed to parse Blue/Green Deployment Identifier. Response:"
  echo "$BG_RESPONSE"
  exit 1
fi

echo "Waiting for Blue/Green deployment ${BG_IDENTIFIER} to become AVAILABLE (this can take a while)..."

while true; do
  STATUS=$(aws rds describe-blue-green-deployments \
    --blue-green-deployment-identifier "$BG_IDENTIFIER" \
    --query "BlueGreenDeployments[0].Status" \
    --region "$REGION" \
    --output text)

  echo "Status: ${STATUS}"

  if [ "$STATUS" == "AVAILABLE" ]; then
    break
  elif [[ "$STATUS" == *"FAILED"* || "$STATUS" == "INCOMPATIBLE_PARAMETERS" ]]; then
    echo "Blue/Green deployment failed to provision. Status: ${STATUS}"
    exit 1
  fi
  sleep 30
done

echo "Blue/Green deployment is available. Initiating switchover..."

aws rds switchover-blue-green-deployment \
  --blue-green-deployment-identifier "$BG_IDENTIFIER" \
  --switchover-timeout 300 \
  --region "$REGION"

echo "Waiting for Switchover to complete..."

while true; do
  STATUS=$(aws rds describe-blue-green-deployments \
    --blue-green-deployment-identifier "$BG_IDENTIFIER" \
    --query "BlueGreenDeployments[0].Status" \
    --region "$REGION" \
    --output text)

  echo "Status: ${STATUS}"

  if [ "$STATUS" == "SWITCHOVER_COMPLETED" ]; then
    break
  elif [[ "$STATUS" == *"FAILED"* ]]; then
    echo "Switchover failed or encountered an error. Check AWS Console."
    exit 1
  fi
  sleep 10
done

echo "Switchover completed successfully!"

echo "Removing the Blue/Green deployment orchestration object..."
aws rds delete-blue-green-deployment \
  --blue-green-deployment-identifier "$BG_IDENTIFIER" \
  --region "$REGION"

echo "Upgrade to ${TARGET_VERSION} complete! Terraform will reconcile the remaining state."
exit 0
