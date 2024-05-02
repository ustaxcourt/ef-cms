
output "elasticsearch_endpoint_alpha" {
  value = length(module.elasticsearch_alpha) > 0 ? module.elasticsearch_alpha[0].endpoint : null
}

output "elasticsearch_endpoint_beta" {
  value = length(module.elasticsearch_beta) > 0 ? module.elasticsearch_beta[0].endpoint : null
}

output "aws_cognito_user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "aws_cognito_user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "aws_cognito_user_pool_irs_id" {
  value = aws_cognito_user_pool.irs_pool.id
}


output "aws_cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "api_lambdas_bucket_east_id" {
  value = aws_s3_bucket.api_lambdas_bucket_east.id
}
output "api_lambdas_bucket_west_id" {
  value = aws_s3_bucket.api_lambdas_bucket_west.id
}

output "west_web_acl_arn" {
  value = module.api-west-waf.web_acl_arn
}

output "east_web_acl_arn" {
  value = module.api-east-waf.web_acl_arn
}

output "aws_route53_health_check_failover_west_id" {
  value = length(aws_route53_health_check.failover_health_check_west) > 0 ? aws_route53_health_check.failover_health_check_west[0].id : ""
}

output "aws_route53_health_check_failover_east_id" {
  value = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : ""
}
