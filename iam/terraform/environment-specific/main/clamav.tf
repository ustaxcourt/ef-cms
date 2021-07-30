
resource "aws_iam_role" "clamav_s3_download_role" {
  name               = "clamav_s3_download_role_${var.environment}"
  assume_role_policy = "${data.aws_iam_policy_document.allow_ec2_to_assume_clamav_s3_download_role.json}"
}

data "aws_iam_policy_document" "allow_ec2_to_assume_clamav_s3_download_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "access_clamav_s3_bucket" {
  name   = "AccessClamAVMonitorS3Bucket_${var.environment}"
  policy = "${data.aws_iam_policy_document.allow_read_access_to_clamav_s3_bucket.json}"
}

data "aws_iam_policy_document" "allow_read_access_to_clamav_s3_bucket" {
  statement {
    actions   = ["sqs:*"]
    resources = ["arn:aws:sqs:*:${data.aws_caller_identity.current.account_id}:s3_clamav_event_*"]
  }
}

resource "aws_iam_role_policy_attachment" "allow_clamav_role_access_to_clamav_s3_bucket" {
  role       = "${aws_iam_role.clamav_s3_download_role.name}"
  policy_arn = "${aws_iam_policy.access_clamav_s3_bucket.arn}"
}

resource "aws_iam_instance_profile" "clamav_instance_profile" {
  name = "clamav_s3_download_instance_profile_${var.environment}"
  role = aws_iam_role.clamav_s3_download_role.name
}
