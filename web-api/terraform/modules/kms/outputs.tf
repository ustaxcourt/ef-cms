output "kms_key_id_primary" {
  value = aws_kms_key.primary.arn
}

output "kms_key_id_replica" {
  value = aws_kms_key.replica.arn
}
