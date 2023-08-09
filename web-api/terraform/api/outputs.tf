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

output "puppeteer_layer_arn" {
  value = aws_lambda_layer_version.puppeteer_layer.arn
}

output "health_check_id" {
  value =  length(aws_route53_health_check.status_health_check) > 0 ?  aws_route53_health_check.status_health_check[0].id : null
}