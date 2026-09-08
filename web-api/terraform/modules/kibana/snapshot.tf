data "aws_caller_identity" "current" {}

locals {
  opensearch_endpoint = length(aws_opensearch_domain.efcms-logs) > 0 ? "https://${aws_opensearch_domain.efcms-logs[0].endpoint}" : "https://${var.es_logs_endpoint}"
}

provider "opensearch" {
  url = local.opensearch_endpoint
}

resource "opensearch_snapshot_repository" "archived-logs" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  name  = "archived-logs"
  type  = "s3"
  settings = {
    bucket   = aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket
    region   = "us-east-1"
    role_arn = aws_iam_role.es_s3_snapshot_access_role[0].arn
  }

  depends_on = [
    aws_opensearch_domain.efcms-logs[0]
  ]
}

resource "aws_iam_role" "es_s3_snapshot_access_role" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  name  = "es_s3_snapshot_access_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "es.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "es_s3_snapshot_access_policy" {
  count = var.es_logs_instance_count > 0 ? 1 : 0
  name  = "es_s3_snapshot_access_policy"
  role  = aws_iam_role.es_s3_snapshot_access_role[0].id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["iam:PassRole", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::${aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket}",
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/es_s3_snapshot_access_role"
      ]
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::${aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket}/*"
    }
  ]}
EOF
}

resource "aws_s3_bucket" "ustc_log_snapshots_bucket" {
  #checkov:skip=CKV_AWS_21: Kibana log snapshot bucket — snapshots are point-in-time exports, not mutable objects; versioning adds cost with no recovery value
  #checkov:skip=CKV_AWS_18: this bucket IS the log store — enabling access logging on it would create circular log growth
  #checkov:skip=CKV_AWS_145: AWS-managed SSE is sufficient for OpenSearch log snapshots — operational log data; CMK adds key management overhead without meaningful security benefit
  #checkov:skip=CKV2_AWS_6: no public access block resource needed — IAM policy restricts access to OpenSearch snapshot role only; account-level S3 Block Public Access covers this
  count         = var.es_logs_instance_count > 0 ? 1 : 0
  bucket        = var.log_snapshot_bucket_name
  force_destroy = false
}
