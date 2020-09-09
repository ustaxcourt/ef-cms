provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "2.70.0"
  }
}

resource "aws_sqs_queue" "migration_segments_queue" {
  name                        = "migration_segments_queue_${var.environment}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}
