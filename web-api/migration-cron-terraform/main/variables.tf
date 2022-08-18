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

variable "deploying_color" {
  type = string
}

variable "circle_workflow_id" {
  type = string
}

variable "migrate_flag" {
  type = bool
}

variable "reindex_flag" {
  type = bool
}

variable "circle_machine_user_token" {
  type = string
}
