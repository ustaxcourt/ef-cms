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

REPLICA_REGION="us-west-1"
REPLICA_CLUSTER_IDENTIFIER="${ENV}-dawson-replica"

echo "Checking for cross-region replica ${REPLICA_CLUSTER_IDENTIFIER} that would block Blue/Green Deployment..."
REPLICA_EXISTS=$(aws rds describe-db-clusters \
  --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
  --region "$REPLICA_REGION" \
  --query "DBClusters[0].DBClusterIdentifier" \
  --output text 2>/dev/null || echo "")

if [ -n "$REPLICA_EXISTS" ]; then
  echo "Replica found. Disabling deletion protection on replica cluster..."
  aws rds modify-db-cluster \
    --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
    --no-deletion-protection \
    --apply-immediately \
    --region "$REPLICA_REGION" >/dev/null

  GLOBAL_CLUSTER_IDENTIFIER="${ENV}-dawson-global"
  
  REPLICA_CLUSTER_ARN=$(aws rds describe-db-clusters \
    --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
    --region "$REPLICA_REGION" \
    --query "DBClusters[0].DBClusterArn" \
    --output text 2>/dev/null || echo "")

  if [ -n "$REPLICA_CLUSTER_ARN" ]; then
    echo "Removing replica cluster from global cluster ${GLOBAL_CLUSTER_IDENTIFIER}..."
    aws rds remove-from-global-cluster \
      --global-cluster-identifier "$GLOBAL_CLUSTER_IDENTIFIER" \
      --db-cluster-identifier "$REPLICA_CLUSTER_ARN" \
      --region "$REGION" >/dev/null || echo "Replica may have already been removed from the global cluster."

    echo "Waiting for replica cluster to detach from the global cluster..."
    sleep 30
  fi

  REPLICA_INSTANCES=$(aws rds describe-db-clusters \
    --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
    --region "$REPLICA_REGION" \
    --query "DBClusters[0].DBClusterMembers[*].DBInstanceIdentifier" \
    --output text)

  for INSTANCE in $REPLICA_INSTANCES; do
    echo "Deleting replica instance ${INSTANCE}..."
    aws rds delete-db-instance \
      --db-instance-identifier "$INSTANCE" \
      --skip-final-snapshot \
      --region "$REPLICA_REGION" >/dev/null
  done

  echo "Waiting for replica instances to be completely deleted (this can take a while)..."
  for INSTANCE in $REPLICA_INSTANCES; do
    while true; do
      INSTANCE_STATUS=$(aws rds describe-db-instances \
        --db-instance-identifier "$INSTANCE" \
        --region "$REPLICA_REGION" \
        --query "DBInstances[0].DBInstanceStatus" \
        --output text 2>/dev/null || echo "deleted")

      echo "Instance ${INSTANCE} status: ${INSTANCE_STATUS}"

      if [[ "$INSTANCE_STATUS" == "deleted" || -z "$INSTANCE_STATUS" ]]; then
        break
      fi
      sleep 30
    done
  done

  echo "Deleting replica cluster ${REPLICA_CLUSTER_IDENTIFIER}..."
  aws rds delete-db-cluster \
    --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
    --skip-final-snapshot \
    --region "$REPLICA_REGION" >/dev/null

  echo "Waiting for replica cluster to be completely deleted..."
  while true; do
    CLUSTER_STATUS=$(aws rds describe-db-clusters \
      --db-cluster-identifier "$REPLICA_CLUSTER_IDENTIFIER" \
      --region "$REPLICA_REGION" \
      --query "DBClusters[0].Status" \
      --output text 2>/dev/null || echo "deleted")

    echo "Cluster ${REPLICA_CLUSTER_IDENTIFIER} status: ${CLUSTER_STATUS}"

    if [[ "$CLUSTER_STATUS" == "deleted" || -z "$CLUSTER_STATUS" ]]; then
      break
    fi
    sleep 10
  done
  echo "Replica deleted! Terraform will automatically rebuild a new replica with the upgraded engine version in the next allColors deployment."
fi

echo "Verifying primary writer instance parameter group status before proceeding..."
PARAM_STATUS=$(aws rds describe-db-clusters \
  --db-cluster-identifier "$DB_CLUSTER_IDENTIFIER" \
  --region "$REGION" \
  --output json 2>/dev/null | jq -r '.DBClusters[0].DBClusterMembers[] | select(.IsClusterWriter == true) | .DBClusterParameterGroupStatus' || echo "")

if [[ "$PARAM_STATUS" == "pending-reboot" ]]; then
  echo "ERROR: The database has a pending parameter group change (likely enabling logical replication)."
  echo "In order to achieve a ZERO-DOWNTIME upgrade, the database must be rebooted during a maintenance window first."
  echo "Aborting the engine upgrade to prevent unexpected reboot downtime."
  exit 1
fi

echo "Initiating Blue/Green Deployment for ${DB_CLUSTER_IDENTIFIER}..."

GLOBAL_CLUSTER_IDENTIFIER="${ENV}-dawson-global"
GLOBAL_EXISTS=$(aws rds describe-global-clusters \
  --global-cluster-identifier "$GLOBAL_CLUSTER_IDENTIFIER" \
  --region "$REGION" \
  --query "GlobalClusters[0].GlobalClusterIdentifier" \
  --output text 2>/dev/null || echo "")

if [ -n "$GLOBAL_EXISTS" ] && [ "$GLOBAL_EXISTS" != "null" ]; then
  echo "Primary cluster is part of a global database. Using the global database as the source..."
  SOURCE_ARN=$(aws rds describe-global-clusters \
    --global-cluster-identifier "$GLOBAL_CLUSTER_IDENTIFIER" \
    --region "$REGION" \
    --query "GlobalClusters[0].GlobalClusterArn" \
    --output text)
else
  SOURCE_ARN=$(aws rds describe-db-clusters \
    --db-cluster-identifier "$DB_CLUSTER_IDENTIFIER" \
    --query "DBClusters[0].DBClusterArn" \
    --region "$REGION" \
    --output text)
fi

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
