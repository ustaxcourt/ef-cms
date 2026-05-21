# Security: the PDF generator runs user-supplied HTML through a headless
# Chromium. To minimize blast radius if that boundary is ever breached, this
# Lambda runs with its own dedicated role scoped to only what the handler
# actually does — write the resulting PDF (and, on failure, the originating
# event) to the temp-documents bucket, and emit CloudWatch logs. It deliberately
# does NOT inherit the shared lambda_role permissions (Cognito admin, SES,
# SSM, RDS, Lambda invoke, etc.) because the PDF generator does not need any
# of those, and granting them would put them within reach of an HTML-injection
# escape.

resource "aws_iam_role" "pdf_generator_role" {
  name = "pdf_generator_role_${var.environment}_${var.current_color}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy" "pdf_generator_policy" {
  name = "pdf_generator_policy_${var.environment}_${var.current_color}"
  role = aws_iam_role.pdf_generator_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords",
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
        ]
        Resource = "arn:aws:s3:::${var.dns_domain}-temp-documents-*/*"
      },
    ]
  })
}

module "pdf_generation_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/pdfGeneration/pdf-generation.ts"
  handler_method = "handler"
  lambda_name    = "pdf_generator_${var.environment}_${var.current_color}"
  role           = aws_iam_role.pdf_generator_role.arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "10240"
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]
}

resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  alarm_name          = "pdf_generator_${var.environment}_${var.current_color}_errors"
  alarm_description   = "Alarm if any pdfs fail to generate. View logs in pdf_generator_${var.environment}_${var.current_color}."
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = module.pdf_generation_lambda.function_name
  }

  alarm_actions = [var.alert_sns_topic_arn]
}
