output "s3_bucket_queue_url" {
  value = aws_sqs_queue.s3_bucket_queue.id
}

output "s3_bucket_dl_queue_url" {
  value = aws_sqs_queue.s3_bucket_dl_queue.id
}
