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
  bucket = var.bucket_name
}

resource "aws_dynamodb_table" "terraform_state_lock" {
  name         = var.dynamo_lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
