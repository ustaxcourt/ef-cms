output "es_info_cluster_arn" {
  value = var.es_info_cluster_create ? module.kibana.es_info_cluster_arn : null
}

output "es_info_cluster_endpoint" {
  value = var.es_info_cluster_create ? module.kibana.es_info_cluster_endpoint : null
}