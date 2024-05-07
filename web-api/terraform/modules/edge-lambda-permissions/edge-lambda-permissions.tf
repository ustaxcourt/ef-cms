resource "aws_iam_service_linked_role" "lambda_replication_role" {
  aws_service_name = "replicator.lambda.amazonaws.com"
}

resource "aws_iam_service_linked_role" "lambda_cloudfront_logger_role" {
  aws_service_name = "logger.cloudfront.amazonaws.com"
}
