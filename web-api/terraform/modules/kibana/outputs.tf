output "es_logs_cluster_arn" {
  value = var.es_logs_instance_count > 0 ? aws_opensearch_domain.efcms-logs[0].arn : null
}

output "es_logs_endpoint" {
  value = var.es_logs_instance_count > 0 ? aws_opensearch_domain.efcms-logs[0].endpoint : null
}
