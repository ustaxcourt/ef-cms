output "elasticsearch_endpoint" {
  value = aws_elasticsearch_domain.efcms-search.endpoint
}

output "elasticsearch_endpoint_1" {
  value = module.elasticsearch_1.aws_elasticsearch_domain.efcms-search.endpoint
}
