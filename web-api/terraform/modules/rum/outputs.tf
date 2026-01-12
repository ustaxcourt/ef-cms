output "app_monitor_id" {
  value = aws_rum_app_monitor.app_monitor.app_monitor_id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.rum_identity_pool.id
}
