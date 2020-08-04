resource "aws_elasticsearch_domain" "efcms-search" {
  domain_name           = "efcms-search-${var.environment}"
  elasticsearch_version = "7.4"

  cluster_config {
    instance_type = "t2.small.elasticsearch"
    instance_count = var.es_instance_count == "" ? "1" : var.es_instance_count
  }

  ebs_options{
    ebs_enabled = true
    volume_size = 10
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  log_publishing_options = {
    enabled                  = "true"
    cloudwatch_log_group_arn = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/aes/debug_${var.environment}"
    log_type                 = "ES_APPLICATION_LOGS"
  }
}
