
output "elasticsearch_endpoint_alpha" {
  value = length(module.elasticsearch_alpha) > 0 ? module.elasticsearch_alpha[0].endpoint : null
}

output "elasticsearch_endpoint_beta" {
  value = length(module.elasticsearch_beta) > 0 ? module.elasticsearch_beta[0].endpoint : null
}
