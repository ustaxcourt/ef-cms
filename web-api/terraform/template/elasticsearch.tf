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
}