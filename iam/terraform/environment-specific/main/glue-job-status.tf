resource "aws_iam_role" "glue_job_status_role" {
  name = "glue_job_status_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "glue_job_status_policy" {
  name = "glue_job_status_policy_${var.environment}"
  role = aws_iam_role.glue_job_status_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*"
      ]
    },
    {
      "Action": [
        "glue:GetJobRuns"
      ],
      "Resource": [
        "arn:aws:glue:us-east-1:${data.aws_caller_identity.current.account_id}:job/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}
