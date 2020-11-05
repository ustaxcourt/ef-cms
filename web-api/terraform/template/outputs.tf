output "elasticsearch_endpoint" {
  value = aws_elasticsearch_domain.efcms-search.endpoint
}

output "elasticsearch_endpoint_1" {
  value = module.elasticsearch_1.endpoint
}

output "elasticsearch_endpoint_2" {
  value = module.elasticsearch_2.endpoint
}

output "elasticsearch_endpoint_3" {
  value = module.elasticsearch_3.endpoint
}

output "elasticsearch_endpoint_4" {
  value = module.elasticsearch_4.endpoint
}

output "elasticsearch_endpoint_alpha" {
  value = module.elasticsearch_alpha.endpoint
}

output "elasticsearch_endpoint_beta" {
  value = module.elasticsearch_beta.endpoint
}

