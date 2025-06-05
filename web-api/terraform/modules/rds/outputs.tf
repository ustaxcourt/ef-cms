output "address" {
  value = aws_rds_cluster.postgres.endpoint
}

output "database_name" {
  value = aws_rds_cluster.postgres.database_name
}

output "postgres_user" {
    value = aws_iam_user.rds_user_dawson.name
}
