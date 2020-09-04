resource "aws_iam_group" "developers" {
  name = "developers"
}

resource "aws_iam_policy" "es_admin_access" {
  name = "es_admin_access_policy"
  description = "A policy that grants an IAM user admin access to Elasticsearch service"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "es:*",
        "Resource": "*"
      }
    ]
}
EOF
}

resource "aws_iam_group_policy_attachment" "es_admin_policy_attachment" {
  group      = aws_iam_group.developers.name
  policy_arn = aws_iam_policy.es_admin_access.arn
}