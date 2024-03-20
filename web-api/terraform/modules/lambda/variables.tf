
variable "handler_file" {
  type = string
}

variable "lambda_name" {
  type = string
}

variable "role" {
  type = string
}

variable "environment" {
  type = any
}

variable "handler_method" {
  type = string
}

variable "timeout" {
  type    = string
  default = "29"
}

variable "publish" {
  type    = bool
  default = false
}

variable "memory_size" {
  type    = string
  default = "3008"
}

variable "layers" {
  type        = list(string)
  default     = null
  description = "list of arns for lambda layers"
}

variable "use_source_maps" {
  type = bool
  default = true
}
