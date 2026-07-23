resource "aws_rds_global_cluster" "global_cluster" {
  global_cluster_identifier = "${var.environment}-dawson-global"
  engine                    = "aurora-postgresql"
  engine_version            = var.engine_version
  storage_encrypted         = true
  deletion_protection       = var.delete_protection

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster_parameter_group" "postgres_parameter_group" {
  name_prefix = "${var.environment}-dawson-cluster-pg"
  family      = "aurora-postgresql${split(".", var.engine_version)[0]}"
  description = "Cluster parameter group for DAWSON postgres ${var.environment}"

  parameter {
    name         = "rds.logical_replication"
    value        = "1"
    apply_method = "pending-reboot"
  }
}

resource "aws_rds_cluster" "postgres" {
  #checkov:skip=CKV_AWS_324: RDS log exports to CloudWatch not enabled — application-level query logging covers audit needs; log export adds cost and volume with marginal security benefit
  #checkov:skip=CKV2_AWS_8: AWS Backup not configured — automated RDS snapshots with 35-day retention already provide point-in-time recovery; AWS Backup would be redundant
  cluster_identifier              = "${var.environment}-dawson-cluster"
  engine                          = "aurora-postgresql"
  engine_mode                     = "provisioned"
  engine_version                  = var.engine_version
  deletion_protection             = var.delete_protection
  database_name                   = "${var.environment}_dawson"
  master_username                 = var.postgres_master_username
  master_password                 = var.postgres_master_password
  storage_encrypted               = true
  global_cluster_identifier       = aws_rds_global_cluster.global_cluster.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.postgres_parameter_group.name

  # snapshot_identifier                 = "exp4-dawson-cluster-1" - used for a snapshot restore
  iam_database_authentication_enabled = true
  kms_key_id                          = var.kms_key_id_primary

  backup_retention_period = 35

  serverlessv2_scaling_configuration {
    max_capacity = var.max_capacity
    min_capacity = var.min_capacity
  }

  lifecycle {
    prevent_destroy = true
    # ignore_changes  = [global_cluster_identifier] - used for a snapshot restore
  }
}

resource "aws_rds_cluster_instance" "cluster_instance" {
  #checkov:skip=CKV_AWS_17:publicly_accessible is intentional — developers connect directly via RDS IAM auth from local machines; long-term fix tracked in Devex ticket (replace with bastion/VPN pattern)
  #checkov:skip=CKV_AWS_118: RDS enhanced monitoring not enabled — deliberate ops choice; standard CloudWatch metrics cover operational needs; enhanced monitoring adds per-instance cost
  #checkov:skip=CKV_AWS_226: auto minor version upgrade disabled — deliberate ops policy; upgrades are controlled via scheduled maintenance windows and Terraform applies to prevent unexpected restarts
  #checkov:skip=CKV_AWS_353: Performance Insights not enabled — standard CloudWatch metrics cover operational needs; PI adds per-instance cost without meaningful benefit for Aurora Serverless v2
  #checkov:skip=CKV_AWS_354: Performance Insights encryption CMK not configured — PI not enabled; CMK moot; AWS-managed encryption adequate if PI is ever enabled
  cluster_identifier  = aws_rds_cluster.postgres.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.postgres.engine
  engine_version      = aws_rds_cluster.postgres.engine_version
  publicly_accessible = true #intentional

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster_parameter_group" "west_replica_parameter_group" {
  provider    = aws.us-west-1
  name_prefix = "${var.environment}-dawson-replica-pg"
  family      = "aurora-postgresql${split(".", var.engine_version)[0]}"
  description = "Cluster parameter group for DAWSON replica postgres ${var.environment}"

  parameter {
    name         = "rds.logical_replication"
    value        = "1"
    apply_method = "pending-reboot"
  }
}

resource "aws_rds_cluster" "west_replica" {
  #checkov:skip=CKV_AWS_324: RDS log exports to CloudWatch not enabled — application-level Prisma query logging covers audit needs; log export adds cost and volume with marginal security benefit
  #checkov:skip=CKV2_AWS_8: AWS Backup not configured — automated RDS snapshots with 35-day retention already provide point-in-time recovery; AWS Backup would be redundant
  provider                            = aws.us-west-1
  cluster_identifier                  = "${var.environment}-dawson-replica"
  engine                              = "aurora-postgresql"
  engine_mode                         = "provisioned"
  engine_version                      = var.engine_version
  deletion_protection                 = var.delete_protection
  storage_encrypted                   = true
  global_cluster_identifier           = aws_rds_global_cluster.global_cluster.id
  db_cluster_parameter_group_name     = aws_rds_cluster_parameter_group.west_replica_parameter_group.name
  iam_database_authentication_enabled = true
  kms_key_id                          = var.kms_key_id_replica
  replication_source_identifier       = aws_rds_cluster.postgres.arn

  serverlessv2_scaling_configuration {
    max_capacity = var.max_capacity
    min_capacity = var.min_capacity
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster_instance" "west_replica_instance" {
  #checkov:skip=CKV_AWS_17:publicly_accessible is intentional — developers connect directly via RDS IAM auth from local machines; long-term fix tracked in Devex ticket (replace with bastion/VPN pattern)
  #checkov:skip=CKV_AWS_118: RDS enhanced monitoring not enabled — deliberate ops choice; standard CloudWatch metrics cover operational needs; enhanced monitoring adds per-instance cost
  #checkov:skip=CKV_AWS_226: auto minor version upgrade disabled — deliberate ops policy; upgrades are controlled via scheduled maintenance windows and Terraform applies to prevent unexpected restarts
  #checkov:skip=CKV_AWS_353: Performance Insights not enabled — standard CloudWatch metrics cover operational needs; PI adds per-instance cost without meaningful benefit for Aurora Serverless v2
  #checkov:skip=CKV_AWS_354: Performance Insights encryption CMK not configured — PI not enabled; CMK moot; AWS-managed encryption adequate if PI is ever enabled
  provider            = aws.us-west-1
  cluster_identifier  = aws_rds_cluster.west_replica.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.west_replica.engine
  engine_version      = aws_rds_cluster.west_replica.engine_version
  publicly_accessible = true  #intentional

  lifecycle {
    prevent_destroy = true
  }
}
