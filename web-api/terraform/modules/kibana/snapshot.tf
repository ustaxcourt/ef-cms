data "aws_caller_identity" "current" {}

locals {
  opensearch_endpoint = length(aws_opensearch_domain.efcms-logs) > 0 ? aws_opensearch_domain.efcms-logs[0].endpoint : var.es_info_cluster_endpoint
  backup_bucket_name  = "${var.log_snapshot_bucket_name}-backup"
}

provider "opensearch" {
  url = local.opensearch_endpoint
}

resource "opensearch_snapshot_repository" "archived-logs" {
  count = var.es_info_cluster_create ? 1 : 0
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
  count = var.es_info_cluster_create ? 1 : 0
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
  count = var.es_info_cluster_create ? 1 : 0
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
  count         = var.es_info_cluster_create ? 1 : 1
  bucket        = var.log_snapshot_bucket_name
  force_destroy = false
}

resource "aws_s3_bucket" "ustc_log_snapshots_bucket_backup" {
  count         = var.es_info_cluster_create ? 0 : 1
  bucket        = local.backup_bucket_name
  force_destroy = false
}

resource "null_resource" "copy_bucket_contents" {
  count = var.es_info_cluster_create ? 0 : 1
  depends_on = [
    aws_s3_bucket.ustc_log_snapshots_bucket,
    aws_s3_bucket.ustc_log_snapshots_bucket_backup
  ]
  provisioner "local-exec" {
    command = "aws s3 cp s3://${aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket} s3://${aws_s3_bucket.ustc_log_snapshots_bucket_backup[0].bucket} --recursive"
  }
}

resource "null_resource" "remove_bucket_contents" {
  count      = var.es_info_cluster_create ? 0 : 1
  depends_on = [null_resource.copy_bucket_contents]
  provisioner "local-exec" {
    command = "aws s3 rm s3://${aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket} --recursive"
  }
}

resource "null_resource" "delete_empty_bucket" {
  count      = var.es_info_cluster_create ? 0 : 1
  depends_on = [null_resource.remove_bucket_contents]
  provisioner "local-exec" {
    command = "aws s3 rb s3://${aws_s3_bucket.ustc_log_snapshots_bucket[0].bucket}"
  }
}