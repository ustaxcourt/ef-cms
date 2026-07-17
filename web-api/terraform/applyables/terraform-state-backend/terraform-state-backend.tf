/*
This Terraform file is special and breaks some conventions.
This files is only used to create the S3 bucket and dynamo table which are required for terraform remote s3 backends + locking
Because this terraform creates the S3 bucket and dynamo table it has no remote backend and so its state file will be created locally.
This should be the only file in the entire /applyables folder which should be creating resources. All others should be in /modules
*/
provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  #checkov:skip=CKV_AWS_21: S3 versioning not enabled on state bucket — DynamoDB provides locking only, not version history; state recovery deprioritized for this bootstrap-only bucket; acceptable given low change frequency
  #checkov:skip=CKV_AWS_145: AWS-managed SSE is sufficient for state files — only the CI/CD role and GODADMIN have access; CMK adds key management overhead without meaningful security benefit for this access pattern
  #checkov:skip=CKV_AWS_18: Terraform state bucket — access logging not warranted; CloudTrail API-level logging covers all state file operations
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "terraform_state_bucket" {
  bucket                  = aws_s3_bucket.terraform_state_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_state_lock" {
  #checkov:skip=CKV_AWS_119:Table holds only Terraform lock IDs (LockID, digest) — no sensitive data; AWS-owned default encryption is adequate
  #checkov:skip=CKV_AWS_28:PITR not needed on ephemeral lock table — rows exist only during active Terraform applies and can be recreated trivially
  name         = var.dynamo_lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
