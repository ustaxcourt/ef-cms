# Postgres - Restore Database

## Database goes offline / Lost data (Fire drill)

Ensure snapshot exists for restore (aws console, rds -> snapshots).

### Manual Restore Process

- In AWS, restore from desired snapshot to restore instance.

- Source to your target env

- Using the script below
`scripts/postgres/connect.sh`

- Temporarily modify the line
`PGPASSWORD="$DB_TOKEN" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"`

To restore the database:
```
PGPASSWORD="$DB_TOKEN" pg_restore \
  --host="$DB_HOST" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --port="$DB_PORT" \
  --format=c \
  --verbose \
  --clean \
  --no-privileges \
  --no-owner \
  --table=dw_case \ # optional if doing per table
  --jobs=3 \
  "backup.sql"
```

To backup the database:
```
PGPASSWORD="$DB_TOKEN" pg_dump \ # change to restore instance password
  --host="$DB_HOST" \ # change to restore instance host
  --username="$DB_USER" \
  --port="$DB_PORT" \
  --dbname="$DB_NAME" \
  --file="backup.sql" \
  --format=c \
  --no-privileges \
  --no-owner \
  --verbose
```

- Run the script for the backup and restore operation (separately one at a time).

- Re-add indexes using tables plus by going to each table on the restore instance under the structure tab copy and paste to target instance (writer).

- Delete the restore instance and regional cluster (in this order).

### Terraform Process

#### Prepare for deletion
- Source to specific env (ex: `source scripts/env/set-env.zsh exp4`)
- Update allColors.tf
  - Toggle delete_protection from true to false.
- Update rds.tf
  - Toggle prevent_destroy from true to false
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

#### Delete global cluster
- Source to specific env (ex: `source scripts/env/set-env.zsh exp4`)
- Update allColors.tf
  - Comment out module "rds"
- Update allColors/output.tf
  - Comment out:
  ```
  output "rds_host_name" {
    value = module.rds.address
  }

  output "rds_host_name_west" {
    value = module.rds.address_west
  }
  ```
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)
- May error trying to remove due to final snapshot, simply ignore, and manually delete inside aws console.


#### Restore East Cluster
- Source to specific env (ex: `source scripts/env/set-env.zsh exp4`)
- In allColors.tf 
  - Uncomment the module "rds" 
  - Toggle delete_protection from false to true. 
- In rds.tf
  - Comment out aws_rds_global_cluster
  - Comment out global_cluster_identifier on the `aws_rds_cluster.postgres`
  - Comment out the west related clusters
  - Comment out the `output.address_west` inside of `rds/outputs.tf`
  - East cluster
    - Uncomment snapshot_identifier and update to the snapshot identifier of your choice
    - Toggle prevent_destroy from false to true
- Update allColors/output.tf
  - Uncomment out:
  ```
  output "rds_host_name" {
    value = module.rds.address
  }
  ```
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

### Restore the Global Cluster
- Uncomment the aws_rds_global_cluster
- Change the cluster to look like this
```
resource "aws_rds_global_cluster" "global_cluster" {
  global_cluster_identifier    = "${var.environment}-dawson-global"
  deletion_protection          = false
  source_db_cluster_identifier = aws_rds_cluster.postgres.arn
  force_destroy                = true

  lifecycle {
    prevent_destroy = false
  }
}
```
- add ignore_changes  = [global_cluster_identifier] to `aws_rds_cluster.postgres` lifecycle block
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

### Restore West Cluster
- Uncomment the aws_rds_cluster.west_replica
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

### Deploy Current Color
- Deploy the current color api so it can use the new database (ex: `npm run deploy:$CURRENT_COLOR exp4`)
- turn DISABLE_HTTP_TRAFFIC on the lambdas to false 
  - do on east and west coast

### Return Terraform back to Original State
- undo any commented out or output changes (git reset --hard)
