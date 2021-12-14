// Creates an SNS Topic that a Lambda can subscribe to in order seal cases in lower environments
resource "aws_sns_topic" "seal_notifier" {
  name = "seal_notifier"
  count = var.prod_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
}

resource "aws_sns_topic_policy" "default" {
  count = var.prod_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  arn = aws_sns_topic.seal_notifier[0].arn
  policy = data.aws_iam_policy_document.sns_topic_policy[0].json
}

data "aws_iam_policy_document" "sns_topic_policy" {
  count = var.prod_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  statement {
    actions = [
      "SNS:Subscribe",
      "SNS:Receive",
    ]

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${var.lower_env_account_id}:root"]
    }

    resources = [
      aws_sns_topic.seal_notifier[0].arn,
    ]
  }
}
