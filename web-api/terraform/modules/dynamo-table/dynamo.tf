resource "aws_dynamodb_table" "efcms-table-east" {
  name         = var.table_name
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

  attribute {
    name = "gsi2pk"
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

  global_secondary_index {
    name            = "gsi2"
    hash_key        = "gsi2pk"
    range_key       = "sk"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags = {
    Name        = var.table_name
    Environment = var.environment
  }

  lifecycle { ignore_changes = [replica] }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  timeouts {
    create = "2h"
    update = "2h"
  }
}

resource "aws_dynamodb_table_replica" "efcms_table_west" {
  global_table_arn = aws_dynamodb_table.efcms-table-east.arn

  provider = aws.us-west-1

  point_in_time_recovery = true

  tags = {
    Name        = var.table_name
    Environment = var.environment
  }

  timeouts {
    create = "2h"
    update = "2h"
  }
}
