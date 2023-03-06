output "migration_segments_queue_url" {
  value = aws_sqs_queue.migration_segments_queue.id
}
