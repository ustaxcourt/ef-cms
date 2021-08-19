output "api_public_custom" {
  value = aws_api_gateway_domain_name.api_public_custom
  sensitive = true
}

output "api_custom" {
  value = aws_api_gateway_domain_name.api_custom
  sensitive = true
}

output "websockets_domain" {
  value = aws_apigatewayv2_domain_name.websockets_domain
}