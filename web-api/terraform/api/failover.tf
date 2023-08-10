resource "aws_route53_health_check" "failover_health_check" {
  // fqdn must be a fully qualified domain name, and the invoke_url is not a domain but a url.
  // Therefore, we are addding the stage ("/exp1") to the resource path, and omitting ("https://") from the fqdn
  // e.g: https://6oz2qiqb7h.execute-api.us-east-1.amazonaws.com/exp1 --> 6oz2qiqb7h.execute-api.us-east-1.amazonaws.com
  reference_name     = "${var.environment} ${var.current_color} Health Check"
  fqdn               = element(split("/", aws_api_gateway_stage.api_public_stage.invoke_url), 2)
  port               = 443
  type               = "HTTPS_STR_MATCH"
  resource_path      = "${var.environment}/public-api/cached-health"
  failure_threshold  = "3"
  request_interval   = "30"
  count              = var.enable_health_checks
  invert_healthcheck = false
  search_string      = "true"                                  # Search for a JSON property returning "true"; fail check if not present
  regions            = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}
