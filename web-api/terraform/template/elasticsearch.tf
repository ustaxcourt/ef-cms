resource "aws_cloudwatch_log_group" "elasticsearch_application_logs" {
  name = "/aws/aes/debug_${var.environment}"
}

resource "aws_elasticsearch_domain" "efcms-search" {
  domain_name           = "efcms-search-${var.environment}"
  elasticsearch_version = "7.4"

  cluster_config {
    instance_type  = var.es_instance_type
    instance_count = var.es_instance_count == "" ? "1" : var.es_instance_count
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.es_volume_size
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_application_logs.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }
}
