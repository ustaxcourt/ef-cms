output "bucket" {
  value       = "${aws_s3_bucket.frontend.bucket}"
  description = "The bucket hosting the built ui src."
}
