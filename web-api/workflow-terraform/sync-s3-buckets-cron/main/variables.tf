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

variable "destination_bucket_name" {
  type = string
}

variable "source_bucket_name" {
  type = string
}
