
resource "aws_dynamodb_table" "efcms-east" {
  provider       = "aws.us-east-1"
  name           = "efcms-${var.environment}"
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

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  global_secondary_index {
    name = "gsi1"
    hash_key = "gsi1pk"
    range_key = "pk"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-${var.environment}"
    Environment = "${var.environment}"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "efcms-west" {
  provider       = "aws.us-west-1"
  name           = "efcms-${var.environment}"
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

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  global_secondary_index {
    name = "gsi1"
    hash_key = "gsi1pk"
    range_key = "pk"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-${var.environment}"
    Environment = "${var.environment}"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  lifecycle {
    prevent_destroy = true
  }
}
