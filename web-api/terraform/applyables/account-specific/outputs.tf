output "es_logs_cluster_arn" {
  value = var.es_logs_instance_count > 0 ? module.kibana.es_logs_cluster_arn : null
}

output "es_logs_endpoint" {
  value = var.es_logs_instance_count > 0 ? module.kibana.es_logs_endpoint : null
}
