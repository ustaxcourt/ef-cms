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

variable "s3_bucket_queue_url" {
  type = string
}

variable "s3_bucket_dl_queue_url" {
  type = string
}

variable "bucket_name" {
  type = string
}

variable "emptying_bucket" {
  type = number
  default = 0
}
