data "archive_file" "zip_triggers" {
  type        = "zip"
  source_file = "${path.module}/cognito-triggers/index.js"
  output_path = "${path.module}/cognito-triggers/index.js.zip"
}

resource "aws_lambda_permission" "allow_trigger" {
  statement_id  = "AllowPostConfirmationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.cognito_post_confirmation_lambda.function_name}"
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "${aws_cognito_user_pool.pool.arn}"
}

resource "aws_lambda_function" "cognito_post_confirmation_lambda" {
  filename      = "${data.archive_file.zip_triggers.output_path}"
  function_name = "cognito_post_confirmation_lambda_${var.environment}"
  role          = "${var.post_confirmation_role_arn}"
  handler       = "index.handler"
  source_code_hash = "${data.archive_file.zip_triggers.output_base64sha256}"
  
  runtime = "nodejs10.x"

  environment {
    variables = {
      DYNAMO_TABLE = "efcms-${var.environment}"
    }
  }
}