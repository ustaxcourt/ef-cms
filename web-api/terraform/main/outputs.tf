output "sls_deployment_bucket" {
  value = "${module.ef-cms_apis.sls_deployment_bucket}"
}

output "user_pool_id" {
  value = "${module.ef-cms_apis.user_pool_id}"
}