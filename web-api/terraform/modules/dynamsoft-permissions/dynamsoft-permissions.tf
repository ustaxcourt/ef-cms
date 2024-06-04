resource "aws_s3_bucket" "dynamsoft" {
  bucket = "${var.zone_name}-software"
  acl = "private"
}

resource "aws_s3_bucket_public_access_block" "dynamsoft" {
  bucket = "${aws_s3_bucket.dynamsoft.id}"
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_iam_role" "dynamsoft_s3_download_role" {
  name = "dynamsoft_s3_download_role"
  assume_role_policy = "${data.aws_iam_policy_document.allow_ec2_to_assume_dynamsoft_s3_download_role.json}"
}

data "aws_iam_policy_document" "allow_ec2_to_assume_dynamsoft_s3_download_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "access_dynamsoft_s3_bucket" {
  name = "AccessSoftwareS3Bucket"
  policy = "${data.aws_iam_policy_document.allow_read_access_to_dynamsoft_s3_bucket.json}"
}

data "aws_iam_policy_document" "allow_read_access_to_dynamsoft_s3_bucket" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.dynamsoft.arn}/*"]
  }
}

resource "aws_iam_role_policy_attachment" "allow_dynamsoft_role_access_to_dynamsoft_s3_bucket" {
  role = "${aws_iam_role.dynamsoft_s3_download_role.name}"
  policy_arn = "${aws_iam_policy.access_dynamsoft_s3_bucket.arn}"
}

resource "aws_iam_instance_profile" "dynamsoft_instance_profile" {
  name = "dynamsoft_s3_download_role"
  role = "${aws_iam_role.dynamsoft_s3_download_role.name}"
}
