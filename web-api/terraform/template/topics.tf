resource "aws_sns_topic" "cloudwatch_alerts" {
  name = "serverless-alerts-topic-${var.environment}"
}

resource "aws_sns_topic" "cloudwatch_alerts" {
  name = "serverless-alerts-topic-${var.environment}"
  provider       = "aws.us-west-1"
}