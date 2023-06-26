provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "3.76.0"
  }
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

resource "aws_cloudwatch_metric_alarm" "send_emails_dl_queue_check" {
  alarm_name          = "${var.environment}_${var.deploying_color} send emails dl queue check"
  alarm_description   = "Alarm that triggers when a message is sent to send_emails_dl_queue_${var.environment}_${var.deploying_color}.fifo"
  namespace           = "AWS/SQS"
  metric_name         = "NumberOfMessagesSent"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 2
  period              = 120

  dimensions = {
    QueueName  = "send_emails_dl_queue_${var.environment}_${var.deploying_color}.fifo"
  }

  alarm_actions       = [data.aws_sns_topic.system_health_alarms.arn]
}


module "ef-cms_apis" {
  source                     = "../template/"
  environment                = var.environment
  zone_name                  = var.zone_name
  dns_domain                 = var.dns_domain
  cognito_suffix             = var.cognito_suffix
  email_dmarc_policy         = var.email_dmarc_policy
  es_instance_count          = var.es_instance_count
  es_instance_type           = var.es_instance_type
  irs_superuser_email        = var.irs_superuser_email
  deploying_color            = var.deploying_color
  blue_table_name            = var.blue_table_name
  green_table_name           = var.green_table_name
  blue_node_version          = var.blue_node_version
  green_node_version         = var.green_node_version
  blue_elasticsearch_domain  = var.blue_elasticsearch_domain
  green_elasticsearch_domain = var.green_elasticsearch_domain
  destination_table          = var.destination_table
  disable_emails             = var.disable_emails
  es_volume_size             = var.es_volume_size
  alert_sns_topic_arn        = data.aws_sns_topic.system_health_alarms.arn
  bounced_email_recipient    = var.bounced_email_recipient
  bounce_alert_recipients    = var.bounce_alert_recipients
  slack_webhook_url          = var.slack_webhook_url
  scanner_resource_uri       = var.scanner_resource_uri
  cognito_table_name         = var.cognito_table_name
  prod_env_account_id        = var.prod_env_account_id
  lower_env_account_id       = var.lower_env_account_id
  should_es_alpha_exist      = var.should_es_alpha_exist
  should_es_beta_exist       = var.should_es_beta_exist
  green_use_layers           = var.green_use_layers
  blue_use_layers            = var.blue_use_layers
}
