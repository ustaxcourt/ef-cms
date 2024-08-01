
output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "subnet_ids" {
  value = aws_db_subnet_group.group.subnet_ids
}
