output "es_logs_cluster_arn" {
  value = var.es_logs_instance_count > 0 ? module.kibana.es_logs_cluster_arn : null
}

output "es_logs_endpoint" {
  value = var.es_logs_instance_count > 0 ? module.kibana.es_logs_endpoint : null
}

output "github_image_scan_role_arn" {
  value = module.ci-cd.github_image_scan_role_arn
}
