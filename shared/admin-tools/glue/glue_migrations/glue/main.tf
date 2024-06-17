data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "job_scripts" {
  bucket_prefix = "aws-glue-efcms-scripts"
  force_destroy = true
}


resource "aws_s3_bucket" "job_temp_files" {
  bucket_prefix = "aws-glue-efcms-temp"
  force_destroy = true
}

resource "aws_iam_role" "glue_role" {
  name = "glue_role_${var.source_table}_${var.destination_table}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "glue.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "glue_policy" {
  name   = "AWSGlueServiceRole-Default"
  role   = aws_iam_role.glue_role.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DescribeTable",
                "dynamodb:Scan",
                "dynamodb:ListTables"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "${var.external_role_arn}"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "AWSGlueServiceRole" {
  role       = aws_iam_role.glue_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}


resource "aws_s3_object" "python_mock_emails" {
  bucket = aws_s3_bucket.job_scripts.id
  key    = "mock_emails.py"
  source = "${path.module}/python_scripts/mock_emails.py"
  etag   = filemd5("${path.module}/python_scripts/mock_emails.py")
}

resource "aws_glue_job" "mock_emails" {
  name              = "mock_emails"
  role_arn          = aws_iam_role.glue_role.arn
  number_of_workers = var.number_of_workers
  glue_version      = "2.0"
  worker_type       = "G.1X"

  default_arguments = {
    "--destination_table" = var.destination_table,
    "--source_table"      = var.source_table,
    "--number_of_workers" = var.number_of_workers,
    "--external_role_arn" = var.external_role_arn
    "--TempDir"           = "s3://${aws_s3_bucket.job_temp_files.bucket}",
    "--enable-metrics"    = "true",
  }

  command {
    script_location = "s3://${aws_s3_bucket.job_scripts.bucket}/${aws_s3_object.python_mock_emails.id}"
    python_version  = "3"
  }
}
