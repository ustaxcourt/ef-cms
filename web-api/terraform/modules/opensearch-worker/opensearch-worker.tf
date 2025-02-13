data "aws_caller_identity" "current" {}

module "opensearch_worker_lambda" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/opensearch/worker-handler.ts"
  handler_method = "workerHandler"
  lambda_name    = "opensearch_worker_lambda_${var.environment}_${var.color}"
  role           = var.lambda_role_arn
  environment    = var.lambda_environment
  timeout        = "900"
  memory_size    = "3008"
}

resource "aws_sqs_queue" "opensearch_worker_queue" {
  name                       = "opensearch_worker_queue_${var.environment}_${var.color}"
  visibility_timeout_seconds = 901
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.opensearch_worker_dl_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_lambda_event_source_mapping" "opensearch_worker_event_mapping" {
  event_source_arn = aws_sqs_queue.opensearch_worker_queue.arn
  function_name    = module.opensearch_worker_lambda.arn
  batch_size       = 1
}

resource "aws_sqs_queue" "opensearch_worker_dl_queue" {
  name                      = "opensearch_worker_dl_queue_${var.environment}_${var.color}"
  message_retention_seconds = 1209600
}

resource "aws_sqs_queue_redrive_allow_policy" "opensearch_worker_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.opensearch_worker_dl_queue.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.opensearch_worker_queue.arn]
  })
}

resource "aws_cloudwatch_metric_alarm" "opensearch_worker_dl_queue_check" {
  alarm_name          = "efcms_${var.environment}_${var.color}: Opensearch-Worker-DLQueueCheck"
  alarm_description   = "Alarm that triggers when a message is sent to opensearch_worker_dl_queue_${var.environment}_${var.color}"
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 1
  period              = 60

  dimensions = {
    QueueName = "opensearch_worker_dl_queue_${var.environment}_${var.color}"
  }

  alarm_actions = [var.alert_sns_topic_arn]
}
