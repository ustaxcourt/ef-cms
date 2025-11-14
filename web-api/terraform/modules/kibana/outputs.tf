output "es_info_cluster_endpoint" {
  value = aws_opensearch_domain.efcms-logs[0].endpoint
}