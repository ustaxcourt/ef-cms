module "dynamo_table_alpha" {
  source = "../dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-alpha"

  providers = {
    aws           = aws
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_beta" {
  source = "../dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-beta"

  providers = {
    aws           = aws
    aws.us-west-1 = aws.us-west-1
  }
}

module "elasticsearch_alpha" {
  source = "../elasticsearch"

  count = var.should_es_alpha_exist ? 1 : 0

  environment         = var.environment
  domain_name         = "efcms-search-${var.environment}-alpha"
  es_instance_count   = var.es_instance_count
  es_instance_type    = var.es_instance_type
  es_volume_size      = var.es_volume_size
  alert_sns_topic_arn = var.alert_sns_topic_arn
}

resource "aws_ssm_parameter" "elasticsearch_alpha_endpoint_ssm" {
  name  = "terraform-${var.environment}-elasticsearch-endpoint-alpha"
  type  = "String"
  value = length(module.elasticsearch_alpha) > 0 ? module.elasticsearch_alpha[0].endpoint : "Alpha Endpoint Does Not Exist"
}

module "elasticsearch_beta" {
  source = "../elasticsearch"

  count = var.should_es_beta_exist ? 1 : 0

  environment         = var.environment
  domain_name         = "efcms-search-${var.environment}-beta"
  es_instance_count   = var.es_instance_count
  es_instance_type    = var.es_instance_type
  es_volume_size      = var.es_volume_size
  alert_sns_topic_arn = var.alert_sns_topic_arn
}

resource "aws_ssm_parameter" "elasticsearch_beta_endpoint_ssm" {
  name  = "terraform-${var.environment}-elasticsearch-endpoint-beta"
  type  = "String"
  value = length(module.elasticsearch_beta) > 0 ? module.elasticsearch_beta[0].endpoint : "Beta Endpoint Does Not Exist"
}
