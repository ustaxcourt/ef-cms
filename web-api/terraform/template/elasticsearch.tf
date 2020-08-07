resource "aws_cloudwatch_log_group" "elasticsearch_application_logs" {
  name = "/aws/aes/debug_${var.environment}"
}

resource "aws_cloudwatch_log_resource_policy" "allow_elasticsearch_to_write_logs" {
  policy_name = "allow_elasticsearch_to_write_logs"

  policy_document = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
CONFIG
}

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

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.elasticsearch_application_logs.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }
}
