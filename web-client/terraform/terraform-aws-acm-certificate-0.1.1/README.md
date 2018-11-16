# terraform-aws-acm-certificate #

Terraform module to create acm certificate, and validate acm certificate

This module create interconnected resources:
* [AWS ACM Certificate](https://www.terraform.io/docs/providers/aws/r/acm_certificate.html)
* [AWS ACM Certificate Validation](https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html)

## Usage ##

### dns_validation ###
```hcl
module "acm_certificate"{
  source              = "https://github.com/traveloka/terraform-aws-acm-certificate"
  domain_name         = "*.example.stg.tvlk.cloud"
  hosted_zone_name    = "example.stg.tvlk.cloud"
  is_hosted_zone_private = "false"
  validation_method   = "DNS"
  certificate_name    = "wildcard.example.stg.tvlk.cloud"
  environment         = "staging"
  description         = "Wildcard certificate for example.stg.tvlk.cloud"
  product_domain      = "exm"
}
```

### email_validation ###
```hcl
  source              = "https://github.com/traveloka/terraform-aws-acm-certificate"
  domain_name         = "*.example.stg.tvlk.cloud"
  hosted_zone_name    = "example.stg.tvlk.cloud"
  is_hosted_zone_private = "true"
  validation_method   = "EMAIL"
  certificate_name    = "wildcard.example.stg.tvlk.cloud"
  environment         = "staging"
  description         = "Wildcard certificate for example.stg.tvlk.cloud"
  product_domain      = "exm"
  
```

## Examples ##
Please see file on examples dir for example on how to use this module:
* [DNS Validation](https://github.com/traveloka/terraform-aws-acm-certificate/tree/master/examples/dns_validation)
* [Email Validation](https://github.com/traveloka/terraform-aws-acm-certificate/tree/master/examples/email_validation)

## Authors ##
Module managed by [BernardSiahaan](https://github.com/siahaanbernard/)

## Known Issues/Limitations ##
AWS doesn't support dns validation for private hosted zone, use EMAIL validation instead.
