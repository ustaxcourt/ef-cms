resource "aws_iam_role" "ecs_role" {
  name               = "ecsExecutionRole-${var.environment}-${var.deployment}"
  assume_role_policy = "${data.aws_iam_policy_document.instance-assume-role-ecs-policy.json}"
}

resource "aws_iam_role" "environment_deployer" {
  name               = "environmentDeployerRole--${var.environment}-${var.deployment}"
  assume_role_policy = "${data.aws_iam_policy_document.instance-assume-role-ec2-policy.json}"
}

resource "aws_iam_instance_profile" "environment_deployer_profile" {
  name = "${aws_iam_role.environment_deployer.name}"
  role = "${aws_iam_role.environment_deployer.name}"
}

data "aws_iam_policy_document" "instance-assume-role-ecs-policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
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

data "aws_iam_policy" "AmazonECSTaskExecutionRolePolicy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy" "AdministratorAccessPolicy" {
  arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_policy" "access_s3" {
  name   = "AccessS3Storage-${var.environment}-${var.deployment}"
  policy = "${data.aws_iam_policy_document.allow_s3.json}"
}

data "aws_iam_policy_document" "allow_s3" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:HeadBucket",
      "s3:GetObjectVersion",
    ]

    effect = "Allow"

    resources = ["*"]
  }
}

resource "aws_iam_role_policy_attachment" "attach_ecs" {
  role       = "${aws_iam_role.ecs_role.name}"
  policy_arn = "${data.aws_iam_policy.AmazonECSTaskExecutionRolePolicy.arn}"
}

resource "aws_iam_role_policy_attachment" "attach_s3" {
  role       = "${aws_iam_role.ecs_role.name}"
  policy_arn = "${aws_iam_policy.access_s3.arn}"
}

resource "aws_iam_role_policy_attachment" "attach_admin" {
  role       = "${aws_iam_role.environment_deployer.name}"
  policy_arn = "${data.aws_iam_policy.AdministratorAccessPolicy.arn}"
}

