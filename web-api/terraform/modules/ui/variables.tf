variable "current_color" {
  type = string
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "viewer_protocol_policy" { # Only being utilized in the Flexion environment to restrict HTTP traffic to flexion domain.
  type    = string
  default = "redirect-to-https"
}
