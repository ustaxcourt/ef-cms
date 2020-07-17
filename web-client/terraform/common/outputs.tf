output "bucket" {
  value       = aws_s3_bucket.frontend.bucket
  description = "The bucket hosting the built ui src."
}

output "bucket_public" {
  value       = aws_s3_bucket.frontend_public.bucket
  description = "The bucket hosting the built public ui src."
}
