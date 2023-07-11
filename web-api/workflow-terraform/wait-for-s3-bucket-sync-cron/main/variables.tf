variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "circle_workflow_id" {
  type = string
}

variable "circle_machine_user_token" {
  type = string
}

variable "s3_bucket_sync_queue_url" {
  type = string
}

variable "s3_bucket_sync_dl_queue_url" {
  type = string
}
