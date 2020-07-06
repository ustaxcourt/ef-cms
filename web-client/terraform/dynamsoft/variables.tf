variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "ami" {
  type = string
}

variable "availability_zones" {
  type = list
}

variable "dynamsoft_s3_zip_path" {
  type = string
}

variable "dynamsoft_url" {
  type = string
}

variable "dynamsoft_product_keys" {
  type = string
}

variable "is_dynamsoft_enabled" {
  default = "1"
  type = string
 }
 
