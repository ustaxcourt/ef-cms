variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "bounced_email_recipient" {
  type = string
}

variable "disable_emails" {
  type = string
}

variable "email_source" {
  type = string
}

variable "inactivity_report_recipients" {
  type = string
}
