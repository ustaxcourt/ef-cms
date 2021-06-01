output "api_public_custom" {
  value = aws_api_gateway_domain_name.api_public_custom
}

output "api_custom" {
  value = aws_api_gateway_domain_name.api_custom
}

output "websockets_domain" {
  value = aws_apigatewayv2_domain_name.websockets_domain
}

output "puppeteer_layer" {
  value = aws_lambda_layer_version.puppeteer_layer.arn
}