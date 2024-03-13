
output "elasticsearch_endpoint_alpha" {
  value = module.ef-cms_apis.elasticsearch_endpoint_alpha
}

output "elasticsearch_endpoint_beta" {
  value = module.ef-cms_apis.elasticsearch_endpoint_beta
}

output "aws_cognito_user_pool_arn" {
  value = module.ef-cms_apis.aws_cognito_user_pool_arn
}

output "api_lambdas_bucket_east_id" {
  value = module.ef-cms_apis.api_lambdas_bucket_east_id
}
output "api_lambdas_bucket_west_id" {
  value = module.ef-cms_apis.api_lambdas_bucket_west_id
}

output "west_web_acl_arn" {
  value = module.ef-cms_apis.west_web_acl_arn
}

output "east_web_acl_arn" {
  value = module.ef-cms_apis.east_web_acl_arn
}

output "aws_route53_health_check_failover_west_id" {
  value = module.ef-cms_apis.aws_route53_health_check_failover_west_id
}

output "aws_route53_health_check_failover_east_id" {
  value = module.ef-cms_apis.aws_route53_health_check_failover_east_id
}

output "aws_cognito_user_pool_client_id" {
  value = module.ef-cms_apis.aws_cognito_user_pool_client_id
}


output "aws_cognito_user_pool_id" {
  value =  module.ef-cms_apis.aws_cognito_user_pool_id
}

output "aws_cognito_user_pool_irs_id" {
  value = module.ef-cms_apis.aws_cognito_user_pool_irs_id
}