output "api_public_custom" {
  value     = aws_api_gateway_domain_name.api_public_custom
  sensitive = true
}

output "api_custom" {
  value     = aws_api_gateway_domain_name.api_custom
  sensitive = true
}

output "websockets_domain" {
  value = aws_apigatewayv2_domain_name.websockets_domain
}

output "puppeteer_layer_arn" {
  value = aws_lambda_layer_version.puppeteer_layer.arn
}

output "public_api_invoke_url" {
  value = aws_api_gateway_stage.api_public_stage.invoke_url
}

output "api_stage_name" {
  value = aws_api_gateway_stage.api_public_stage.stage_name
}
