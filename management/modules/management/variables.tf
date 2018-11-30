variable "dns_domain" {
  type        = "string"
  description = "The domain name that all other services will be based upon. For example, \"prototype.flexion.us\". There must be a Route53 hosted zone with that domain name."
}

variable "ssh_cidrs" {
  default     = []
  description = "A list of CIDRs that will be allowed SSH access to the bastion host."
}

variable "jenkins_instance_type" {
  type        = "string"
  default     = "c5.xlarge"
}

variable "environment" {
  type = "string"
}

variable "deployment" {
  type = "string"
}
