module "acm" {
  source = "../../"

  domain_name            = "*.example.stg.tvlk.cloud"
  hosted_zone_name       = "example.stg.tvlk.cloud"
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "wildcard.example.stg.tvlk.cloud"
  environment            = "staging"
  description            = "Wildcard certificate for example.stg.tvlk.cloud"
  product_domain         = "exm"
}
