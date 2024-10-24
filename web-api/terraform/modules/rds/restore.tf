resource "aws_iam_role" "restore_role" {
  name = "restore_role_${var.environment}"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${var.restoring_aws_account_id}:root"
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        },
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/dawson_dev"
          },
          "Action": "sts:AssumeRole"
        },
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/CircleCI"
          },
          "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "rds_restore_policy" {
  name = "restore_${var.environment}"
  role = aws_iam_role.restore_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "rds-db:connect",
        Resource = [
          "arn:aws:rds-db:*:${data.aws_caller_identity.current.account_id}:dbuser:*/${aws_iam_user.rds_user_dawson.name}",
          "arn:aws:rds-db:*:${data.aws_caller_identity.current.account_id}:dbuser:*/${aws_iam_user.rds_user_developers.name}"
        ]
      },
      {
        Effect = "Allow",
        Action = ["rds:DescribeDBClusters"],
        Resource = [
          "${aws_rds_cluster.postgres.arn}",
        ]
      }
    ]
  })
}
