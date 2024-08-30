# Postgres - Restore Database

## Database goes offline (Fire drill)

Ensure snapshot exists for restore (aws console, rds -> snapshots).

### Terraform Process

#### Prepare for deletion
- Source to specific env (ex: `source scripts/env/set-env.zsh exp4`)
- Update allColors.tf
  - Toggle delete_protection from true to false.
- Update rds.tf
  - Toggle prevent_destroy from true to false
  - Uncomment skip_final_snapshot
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
  - Comment out the west related clusters, and outputs
  - East cluster
    - Uncomment snapshot_identifier and update to the snapshot identifier of your choice
    - Toggle prevent_destroy from true to false
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
  global_cluster_identifier    = "${var.environment}-dawson-global${var.postgres_postfix}"
  deletion_protection          = false
  source_db_cluster_identifier = aws_rds_cluster.postgres.arn
  force_destroy                = true

  lifecycle {
    prevent_destroy = false
  }
}
```
- add ignore_changes  = [global_cluster_identifier] to aws_rds_cluster.postgres lifecycle block
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

### Restore West Cluster
- Uncomment the aws_rds_cluster.west_replica
- Run deploy allColors (ex: `npm run deploy:allColors exp4`)

### Return Terraform back to Original State
- undo any commented out or output changes (git reset --hard)

## Database needs to serve traffic but be restored

- Uncomment module "rds-cluster" in allColors.tf
- Update postgres_postfix to a value not in use (ex: -1, -2, -3, etc)
- Update postgres_snapshot to the snapshot identifier of your choice
- Update allColors/outputs.tf
  - Change the following output:
  ```
    output "rds_host_name" {
      value = module.rds.address
    }
  ```
    to
  ```
    output "rds_host_name" {
      value = module.rds-cluster.address
    }
  ```
  - Change the following output:
  ```
    output "rds_host_name_west" {
      value = module.rds.address_west
    }
  ```
    to
  ```
    output "rds_host_name_west" {
      value = module.rds-cluster.address_west
    }
  ```
  - Deploy terraform allColors
  - Deploy terraform blue
  - Deploy terraform green
  - Write one time script to resolve differences between original rds cluster and restored rds cluster
  - Run one time script sync differences