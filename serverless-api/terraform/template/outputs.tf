output "sls_deployment_bucket" {
  value = "${aws_s3_bucket.deployment.id}"
}
