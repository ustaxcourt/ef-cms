output "elasticsearch_endpoint" {
  value = aws_elasticsearch_domain.efcms-search.endpoint
}

output "elasticsearch_kibana_domain_arn" {
  value = aws_elasticsearch_domain.efcms-logs.arn
}
