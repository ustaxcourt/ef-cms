output "user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "dynamo_stream_arn" {
  value = aws_dynamodb_table.efcms-east.stream_arn
}

output "elasticsearch_endpoint" {
  value = aws_elasticsearch_domain.efcms-search.endpoint
}
