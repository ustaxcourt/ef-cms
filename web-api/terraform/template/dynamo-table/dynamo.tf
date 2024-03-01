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

   attribute {
    name = "gsi2pk"
    type = "S"
  }

  attribute {
    name = "gsi3pk"
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

  global_secondary_index {
    name            = "gsi3"
    hash_key        = "gsi3pk"
    range_key       = "sk"
    projection_type = "ALL"
  }

  # if glue job, and 10252 is only in test
    # we need to run the "migration" after in order to repopulate the gsi3pk
    # ... because the data itself woudn't have the gsi3pk key:value pair saved
  # if glue job and 10252 is in prod and test
    # we don't need to do anything special

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
