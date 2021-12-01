// Creates an SNS Topic that a Lambda can subscribe to in order seal cases in lower environments
resource "aws_sns_topic" "sealed_case_notifier" {
  name = "sealed_case_notifier"
  count = var.prod_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  policy = <<EOF
{
  "Sid": "",
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::${var.lower_env_account_id}:root"
  },
  "Action": [
    "SNS:Subscribe",
    "SNS:Receive"
  ],
  "Resource": "arn:aws:sns:us-east-1:${var.prod_env_account_id}:sealed_case_notifier"
}
EOF
}
