resource "aws_elasticsearch_domain" "efcms-search" {
  domain_name           = "search-${var.environment}.${var.dns_domain}"
  elasticsearch_version = "7.1"

  cluster_config {
    instance_type = "t2.small.elasticsearch"
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }
}