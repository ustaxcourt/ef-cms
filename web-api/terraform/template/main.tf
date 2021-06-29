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

module "dynamo_table_alpha" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-alpha"
}

module "dynamo_table_beta" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-beta"
}

module "elasticsearch_alpha" {
  source = "./elasticsearch"

  environment         = var.environment
  domain_name         = "efcms-search-${var.environment}-alpha"
  es_instance_count   = var.es_instance_count
  es_instance_type    = var.es_instance_type
  es_volume_size      = var.es_volume_size
  alert_sns_topic_arn = var.alert_sns_topic_arn

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_beta" {
  source = "./elasticsearch"

  environment         = var.environment
  domain_name         = "efcms-search-${var.environment}-beta"
  es_instance_count   = var.es_instance_count
  es_instance_type    = var.es_instance_type
  es_volume_size      = var.es_volume_size
  alert_sns_topic_arn = var.alert_sns_topic_arn

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}
