resource "aws_dynamodb_table" "efcms-deploy" {	
  provider       = aws.us-east-1
  name           = "efcms-deploy-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "pk"
  range_key = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name        = "efcms-deploy-${var.environment}"
    Environment = var.environment
  }
}
