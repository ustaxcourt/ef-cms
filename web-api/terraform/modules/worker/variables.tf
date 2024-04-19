variable "environment" {
  type = string
}

variable "lambda_role_arn" {
  type = string
}

variable "lambda_environment" {
  type = map(any)
}

variable "color" {
  type = string
}

variable "alert_sns_topic_arn" {
  type = string
}
