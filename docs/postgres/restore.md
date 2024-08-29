# Postgres Restore Database

## Database goes offline

Assumes snapshot exists

### Manual Process
- Turn on maintenance mode (optional), otherwise expect error 400 upon viewing dashboard.
- Disable delete protection on the global database, primary cluster, and secondary cluster.
  - For global, source to env, run `aws rds modify-global-cluster --global-cluster-identifier <cluster identifier> --no-deletion-protection` 
- Delete replica instance
- Promote replica cluster 
- Delete the replica cluster
- Delete primary instance
- Delete primary cluster
- Delete global database cluster
- In allColors.tf for the module "rds", update postgres_snapshot to the snapshot identifier of your choice
- Toggle delete_protection in allColors.tf
- Deploy terraform allColors

### Terraform Process
- Update allColors.tf
  - Toggle delete_protection from true to false.
- Update rds.tf
  - Toggle prevent_destroy from true to false
- Run deploy allColors
-


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