
resource "aws_iam_role" "es_s3_snapshot_access_role" {
  name = "es_s3_snapshot_access_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "es_s3_snapshot_access_policy" {
  name = "es_s3_snapshot_access_policy"
  role = aws_iam_role.es_s3_snapshot_access_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket" "ustc_log_snapshots_bucket" {
  bucket = "ustc-log-snapshots"
#   acl    = "private"
  force_destroy = false
}
