resource "aws_iam_service_linked_role" "lambda_replication_role" {
  aws_service_name = "replicator.lambda.amazonaws.com"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/dawson_dev",
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/CircleCI",
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_service_linked_role" "lambda_cloudfront_logger_role" {
  aws_service_name = "logger.cloudfront.amazonaws.com"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/dawson_dev",
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/CircleCI",
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
