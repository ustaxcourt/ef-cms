
resource "aws_dynamodb_table" "efcms-migration-east" {
  provider     = aws.us-east-1
  name         = "efcms-${var.environment}-1"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "pk"
  range_key = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "pk"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags = {
    Name        = "efcms-${var.environment}-1"
    Environment = var.environment
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "efcms-migration-west" {
  provider     = aws.us-west-1
  name         = "efcms-${var.environment}-1"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "pk"
  range_key = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "pk"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags = {
    Name        = "efcms-${var.environment}-1"
    Environment = var.environment
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_global_table" "efcms-migration-global" {
  depends_on = [
    aws_dynamodb_table.efcms-migration-east,
    aws_dynamodb_table.efcms-migration-west,
  ]

  name = "efcms-${var.environment}-1"

  replica {
    region_name = "us-east-1"
  }

  replica {
    region_name = "us-west-1"
  }
}
