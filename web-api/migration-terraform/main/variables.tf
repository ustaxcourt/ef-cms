variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "stream_arn" {
  type = string
}

variable "destination_table" {
  type = string
}

variable "source_table" {
  type = string
}

variable "documents_bucket_name" {
  type = string
}

variable "deploying_color" {
  type = string
}

variable "circle_workflow_id" {
  type = string
}
