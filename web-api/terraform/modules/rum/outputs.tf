output "app_monitor_id" {
  value = aws_rum_app_monitor.app_monitor.app_monitor_id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.rum_identity_pool.id
}

output "public_app_monitor_id" {
  value = aws_rum_app_monitor.public_app_monitor.app_monitor_id
}

output "public_identity_pool_id" {
  value = aws_cognito_identity_pool.rum_identity_pool_public.id
}

output "sourcemap_bucket" {
  value = aws_s3_bucket.rum_sourcemaps.bucket
}
