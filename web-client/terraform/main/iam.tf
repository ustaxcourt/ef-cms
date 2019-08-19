
resource "aws_iam_role" "dynamsoft_role" {
  name               = "dynamsoft_role-${var.environment}"
  assume_role_policy = "${data.aws_iam_policy_document.instance-assume-role-ec2-policy.json}"
}

resource "aws_iam_instance_profile" "dynamsoft_profile" {
  name = "${aws_iam_role.dynamsoft_role.name}"
  role = "${aws_iam_role.dynamsoft_role.name}"
}

data "aws_iam_policy_document" "instance-assume-role-ec2-policy" {
  statement {
    actions = ["sts:AssumeRole"]
     principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "access_s3" {
  name   = "AccessS3Storage-${var.environment}"
  policy = "${data.aws_iam_policy_document.allow_s3.json}"
}

resource "aws_iam_role_policy_attachment" "attach_s3" {
  role       = "${aws_iam_role.dynamsoft_role.name}"
  policy_arn = "${aws_iam_policy.access_s3.arn}"
}

data "aws_iam_policy_document" "allow_s3" {
  statement {
    actions = [
      "s3:*",
    ]

    effect = "Allow"

    resources = ["*"]
  }
}