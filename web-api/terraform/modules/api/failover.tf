resource "aws_ssm_parameter" "failover_ssm_params" {
  count = var.enable_health_checks
  name  = "terraform-${var.environment}-${var.region}-${var.current_color}-failover-params"
  type  = "String"
  value = "{\"fqdn\":\"${element(split("/", aws_api_gateway_stage.api_public_stage.invoke_url), 2)}\",\"healthCheckId\":\"${var.health_check_id}\"}"
  provider   = aws.us-east-1
}
// "value" must always be a string, or comma-separated string of strings

