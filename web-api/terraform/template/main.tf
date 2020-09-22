module "environment" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-1"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}
