

resource "aws_sqs_queue" "migration_segments_queue" {
  name                        = "migration_segments_queue_${var.environment}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}
