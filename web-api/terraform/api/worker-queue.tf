resource "aws_lambda_function" "worker_lambda" {
  function_name    = "worker_lambda_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "worker-handler.workerHandler"
  timeout          = "900"
  memory_size      = "3008"
  runtime          = var.node_version
  depends_on       = [var.worker_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "worker_${var.current_color}.js.zip"
  source_code_hash = var.worker_object_hash

  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_sqs_queue" "worker_queue" {
  name = "worker_queue_${var.environment}_${var.current_color}"
  visibility_timeout_seconds = 901
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.worker_dl_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_lambda_event_source_mapping" "worker_event_mapping" {
  event_source_arn = aws_sqs_queue.worker_queue.arn
  function_name    = aws_lambda_function.worker_lambda.arn
  batch_size       = 1
}

resource "aws_sqs_queue" "worker_dl_queue" {
  name = "worker_dl_queue_${var.environment}_${var.current_color}"
}

resource "aws_sqs_queue_redrive_allow_policy" "worker_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.worker_dl_queue.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.worker_queue.arn]
  })
}

resource "aws_cloudwatch_metric_alarm" "worker_dl_queue_check" {
  alarm_name          = "efcms_${var.environment}_${var.current_color}: Worker-DLQueueCheck"
  alarm_description   = "Alarm that triggers when a message is sent to worker_dl_queue_${var.environment}_${var.current_color}"
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  comparison_operator = "GreaterThanThreshold"
  statistic           = "Sum"
  threshold           = 0
  evaluation_periods  = 1
  period              = 60

  dimensions = {
    QueueName = "worker_dl_queue_${var.environment}_${var.current_color}"
  }

  alarm_actions = [var.alert_sns_topic_arn]
}
