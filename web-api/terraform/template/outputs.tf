output "sls_deployment_bucket" {
  value = "${aws_s3_bucket.deployment_us_east_1.id}"
}

output "user_pool_id" {
  value = "${aws_cognito_user_pool.pool.id}"
}