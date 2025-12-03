output "es_info_cluster_arn" {
  value = var.es_info_cluster_create ? aws_opensearch_domain.efcms-logs[0].arn : null
}

output "es_info_cluster_endpoint" {
  value = var.es_info_cluster_create? aws_opensearch_domain.efcms-logs[0].endpoint : null
}
