output "sls_deployment_bucket" {
  value = module.ef-cms_apis.sls_deployment_bucket
}

output "user_pool_id" {
  value = module.ef-cms_apis.user_pool_id
}

output "dynamo_stream_arn" {
  value = module.ef-cms_apis.dynamo_stream_arn
}

output "elasticsearch_endpoint" {
  value = module.ef-cms_apis.elasticsearch_endpoint
}