output "s3_bucket_sync_queue_url" {
  value = aws_sqs_queue.s3_bucket_sync_queue.id
}

output "s3_bucket_sync_dl_queue_url" {
  value = aws_sqs_queue.s3_bucket_sync_dl_queue.id
}
