output "es_kibana_role_arn" {
  value = aws_iam_role.es_kibana_role.arn
}

output "log_viewers_user_pool_id" {
  value = aws_cognito_user_pool.log_viewers.id
}

output "log_viewers_identity_pool_id" {
  value = aws_cognito_identity_pool.log_viewers.id
}
