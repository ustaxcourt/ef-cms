resource "aws_dynamodb_table" "cases-east" {
  provider       = "aws.us-east-1"
  name           = "efcms-cases-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

  hash_key = "caseId"

  attribute {
    name = "caseId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "docketNumber"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  global_secondary_index {
    name            = "DocketNumberIndex"
    hash_key        = "docketNumber"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "StatusIndex"
    hash_key        = "status"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "userId"
    range_key       = "caseId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags {
    Name        = "efcms-cases-${var.environment}"
    Environment = "${var.environment}"
  }
}

resource "aws_dynamodb_table" "cases-west" {
  provider       = "aws.us-west-1"
  name           = "efcms-cases-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

  hash_key = "caseId"

  attribute {
    name = "caseId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "docketNumber"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  global_secondary_index {
    name            = "DocketNumberIndex"
    hash_key        = "docketNumber"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "StatusIndex"
    hash_key        = "status"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "userId"
    range_key       = "caseId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags {
    Name        = "efcms-cases-${var.environment}"
    Environment = "${var.environment}"
  }
}

resource "aws_dynamodb_table" "documents-east" {
  provider       = "aws.us-east-1"
  name           = "efcms-documents-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

  hash_key = "documentId"

  attribute {
    name = "documentId"
    type = "S"
  }

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-documents-${var.environment}"
    Environment = "${var.environment}"
  }
}

resource "aws_dynamodb_table" "documents-west" {
  provider       = "aws.us-west-1"
  name           = "efcms-documents-${var.environment}"
  read_capacity  = "1"
  write_capacity = "1"

  hash_key = "documentId"

  attribute {
    name = "documentId"
    type = "S"
  }

  ttl {
    attribute_name = "timeToLive"
    enabled        = false
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags {
    Name        = "efcms-documents-${var.environment}"
    Environment = "${var.environment}"
  }
}
