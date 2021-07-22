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

resource "aws_dynamodb_table" "efcms-table-east" {
  provider     = aws.us-east-1
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
    Name        = var.table_name
    Environment = var.environment
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  replica {
    region_name = "us-west-1"
  }
  timeouts {
    create = "2h"
    update = "2h"
  }
}
