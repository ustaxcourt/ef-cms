resource "aws_rds_global_cluster" "global_cluster" {
  global_cluster_identifier = "${var.environment}-dawson-global"
  engine                    = "aurora-postgresql"
  storage_encrypted         = true
  deletion_protection       = var.delete_protection

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster" "postgres" {
  cluster_identifier  = "${var.environment}-dawson-cluster"
  engine              = "aurora-postgresql"
  engine_mode         = "provisioned"
  engine_version      = var.engine_version
  deletion_protection = var.delete_protection
  database_name       = "${var.environment}_dawson"
  master_username     = var.postgres_master_username
  master_password     = var.postgres_master_password
  storage_encrypted   = true
  global_cluster_identifier = aws_rds_global_cluster.global_cluster.id
  # snapshot_identifier                 = "exp4-dawson-cluster-1" - used for a snapshot restore
  iam_database_authentication_enabled = true
  kms_key_id                          = var.kms_key_id_primary

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
  cluster_identifier  = aws_rds_cluster.postgres.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.postgres.engine
  engine_version      = aws_rds_cluster.postgres.engine_version
  publicly_accessible = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster" "west_replica" {
  provider                            = aws.us-west-1
  cluster_identifier                  = "${var.environment}-dawson-replica"
  engine                              = "aurora-postgresql"
  engine_mode                         = "provisioned"
  engine_version                      = var.engine_version
  deletion_protection                 = var.delete_protection
  storage_encrypted                   = true
  global_cluster_identifier           = aws_rds_global_cluster.global_cluster.id
  iam_database_authentication_enabled = true
  kms_key_id                          = var.kms_key_id_replica

  depends_on = [aws_rds_cluster.postgres]

  serverlessv2_scaling_configuration {
    max_capacity = var.max_capacity
    min_capacity = var.min_capacity
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_rds_cluster_instance" "west_replica_instance" {
  provider            = aws.us-west-1
  cluster_identifier  = aws_rds_cluster.west_replica.id
  instance_class      = "db.serverless"
  engine              = aws_rds_cluster.west_replica.engine
  engine_version      = aws_rds_cluster.west_replica.engine_version
  publicly_accessible = true

  lifecycle {
    prevent_destroy = true
  }
}
