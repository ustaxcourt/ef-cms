
resource "aws_dynamodb_table" "efcms-east" {
  provider       = "aws.us-east-1"
  name           = "efcms-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

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

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-${var.environment}"
    Environment = "${var.environment}"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "efcms-west" {
  provider       = "aws.us-west-1"
  name           = "efcms-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

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

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-${var.environment}"
    Environment = "${var.environment}"
  }

  lifecycle {
    prevent_destroy = true
  }
}