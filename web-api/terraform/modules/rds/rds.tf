resource "aws_rds_global_cluster" "global_cluster" {
  global_cluster_identifier = "${var.environment}-global-dawson-cluster"
  engine                    = "aurora-postgresql"
}

resource "aws_rds_cluster" "postgres" {
  cluster_identifier = "${var.environment}-dawson-cluster"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = var.engine_version
  database_name      = "${var.environment}_dawson"
  master_username    = var.postgres_user
  master_password    = var.postgres_password
  storage_encrypted  = true
  global_cluster_identifier = aws_rds_global_cluster.global_cluster.id

  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }
}

resource "aws_rds_cluster_instance" "cluster_instance" {
  cluster_identifier = aws_rds_cluster.postgres.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.postgres.engine
  engine_version     = aws_rds_cluster.postgres.engine_version
}

resource "aws_rds_cluster" "west_replica" {
  provider               = aws.us-west-1
  cluster_identifier     = "${var.environment}-dawson-replica"
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = var.engine_version
  storage_encrypted      = true
  global_cluster_identifier = aws_rds_global_cluster.global_cluster.id
}

resource "aws_rds_cluster_instance" "west_replica_instance" {
  provider               = aws.us-west-1
  cluster_identifier     = aws_rds_cluster.west_replica.id
  instance_class         = "db.serverless"
  engine                 = aws_rds_cluster.west_replica.engine
  engine_version         = aws_rds_cluster.west_replica.engine_version
}