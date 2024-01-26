
data "aws_caller_identity" "current" {}


resource "aws_lambda_permission" "allow_post_auth_trigger" {
  statement_id  = "AllowPostAuthenticationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_authentication_lambda[0].function_name
  principal     = "cognito-idp.amazonaws.com"
  count         = var.create_triggers
  source_arn    = var.pool_arn
}

resource "aws_lambda_function" "cognito_post_authentication_lambda" {
  function_name    = "cognito_post_authentication_lambda_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_post_authentication_lambda_role_${var.environment}"
  handler          = "cognito-triggers.handler"
  timeout          = "29"
  memory_size      = "3008"
  runtime          = var.node_version
  depends_on       = [var.triggers_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "triggers_${var.current_color}.js.zip"
  source_code_hash = var.triggers_object_hash
  count            = var.create_triggers

  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}


resource "aws_lambda_function" "update_petitioner_cases_lambda" {
  function_name    = "update_petitioner_cases_lambda_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_update_petitioner_cases_lambda_role_${var.environment}"
  handler          = "cognito-triggers.updatePetitionerCasesLambda"
  timeout          = "29"
  count            = var.create_triggers
  memory_size      = "3008"
  runtime          = var.node_version
  depends_on       = [var.triggers_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "triggers_${var.current_color}.js.zip"
  source_code_hash = var.triggers_object_hash

  layers = var.use_layers ? [aws_lambda_layer_version.puppeteer_layer.arn] : null

  environment {
    variables = var.lambda_environment
  }
}


resource "aws_sqs_queue" "update_petitioner_cases_queue" {
  name = "update_petitioner_cases_queue_${var.environment}_${var.current_color}"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.update_petitioner_cases_dl_queue[0].arn
    maxReceiveCount     = 1
  })
  count = var.create_triggers
}

resource "aws_lambda_event_source_mapping" "update_petitioner_cases_mapping" {
  event_source_arn = aws_sqs_queue.update_petitioner_cases_queue[0].arn
  function_name    = aws_lambda_function.update_petitioner_cases_lambda[0].arn
  batch_size       = 1
  count            = var.create_triggers
}

resource "aws_sqs_queue" "update_petitioner_cases_dl_queue" {
  count = var.create_triggers
  name  = "update_petitioner_cases_dl_queue_${var.environment}_${var.current_color}"
}
