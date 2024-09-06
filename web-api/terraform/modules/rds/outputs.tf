output "address" {
  value = aws_rds_cluster.postgres.endpoint
}

output "address_west" {
  value = aws_rds_cluster.west_replica.endpoint
}

output "database_name" {
  value = aws_rds_cluster.postgres.database_name
}