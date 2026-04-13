# Zero-Downtime PostgreSQL Engine Upgrades

DAWSON leverages Amazon Aurora PostgreSQL Blue/Green Deployments to perform engine upgrades with zero downtime. This prevents the need to enter the application into maintenance mode and ensures high availability while upgrading the primary and replica databases.

## Process

Follow these steps to perform a PostgreSQL engine upgrade.

### 1. Determine if an upgrade is available

First, determine the Postgres engine version that is currently running:

```bash
aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" --query "DBClusters[0].EngineVersion" --region us-east-1 --output text
```

Next, check the list of available Aurora PostgreSQL engine versions:

```bash
aws rds describe-db-engine-versions --engine aurora-postgresql --query '*[].[EngineVersion]' --output text
```

Examine the output to see if there is a newer version available.

### 2. Update the target version in Secrets Manager

If there is an engine version upgrade available, you must update the `RDS_ENGINE_VERSION` secret in AWS Secrets Manager for the target environment. You can use the `update-secret` script to update this value:

```bash
./scripts/secrets/update-secret.ts --key "RDS_ENGINE_VERSION" --value "<new value>"
```

*Replace `<new value>` with the target version (e.g., `17.9`).*

### 3. Run a deployment

Run a deployment as normal through CircleCI.

During the deployment, the CI/CD pipeline will automatically:
- Detect the version mismatch between your current cluster and the newly requested `RDS_ENGINE_VERSION`.
- Provision a new (e.g. "green") environment running the new engine version alongside the active (e.g. "blue") environment.
- Allow replication to synchronize fully.
- Seamlessly switch traffic over to the new (e.g. "green") environment without dropping any requests or requiring maintenance mode.
