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
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["iam:PassRole", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::${var.log_snapshot_bucket_name}",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/es_s3_snapshot_access_role"
      ]
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::${var.log_snapshot_bucket_name}/*"
    }
  ]}
EOF
}

resource "aws_s3_bucket" "ustc_log_snapshots_bucket" {
  bucket = "${var.log_snapshot_bucket_name}"
  force_destroy = false
}

resource "aws_s3_bucket_acl" "ustc_log_snapshots_bucket" {
  bucket = aws_s3_bucket.ustc_log_snapshots_bucket.id
  acl = "private"
}
