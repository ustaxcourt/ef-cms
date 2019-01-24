provider "aws" {
  region = "us-east-1"
  alias = "us-east-1"
}

provider "aws" {
  region = "us-east-2"
  alias = "us-east-2"
}

provider "aws" {
  region = "us-west-1"
  alias = "us-west-1"
}

resource "aws_s3_bucket" "deployment_us_east_1" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.deploys"
  acl = "private"
  provider = "aws.us-east-1"
  region = "us-east-1"

  tags {
    environment = "${var.environment}"
  }
}


resource "aws_s3_bucket" "deployment_us_west_2" {
  provider = "aws.us-west-1"
  region = "us-west-1"
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.deploys"
  acl = "private"

  tags {
    environment = "${var.environment}"
  }
}

resource "aws_s3_bucket" "documents_us_east_1" {
  provider = "aws.us-east-1"
  region = "us-east-1"
  bucket = "${var.dns_domain}.documents-${var.environment}.us-east-1"
  acl = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  replication_configuration {
    role = "${aws_iam_role.replication_role.arn}"

    rules {
      prefix = ""
      status = "Enabled"

      destination {
        bucket        = "${aws_s3_bucket.documents_us_west_1.arn}"
        storage_class = "STANDARD"
      }
    }
  }

  versioning {
    enabled = true
  }

  tags {
    environment = "${var.environment}"
  }
}

resource "aws_s3_bucket" "documents_us_west_1" {
  provider = "aws.us-west-1"
  region = "us-west-1"
  bucket = "${var.dns_domain}.documents-${var.environment}.us-west-1"
  acl = "private"

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  replication_configuration {
    role = "${aws_iam_role.replication_role.arn}"

    rules {
      prefix = ""
      status = "Enabled"

      destination {
        bucket        = "${aws_s3_bucket.documents_us_east_1.arn}"
        storage_class = "STANDARD"
      }
    }
  }

  versioning {
    enabled = true
  }

  tags {
    environment = "${var.environment}"
  }
}

resource "aws_iam_role" "replication_role" {
  name = "efcms-s3-replication-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "replication_policy" {
  name = "tf-iam-role-policy-replication-12345"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetReplicationConfiguration",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.documents_us_west_1.arn}/*",
        "${aws_s3_bucket.documents_us_east_1.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:GetObjectVersion",
        "s3:GetObjectVersionAcl"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.documents_us_west_1.arn}/*",
        "${aws_s3_bucket.documents_us_east_1.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.documents_us_west_1.arn}/*",
        "${aws_s3_bucket.documents_us_east_1.arn}/*"
      ]
    }
  ]
}
POLICY
}

resource "aws_iam_policy_attachment" "replication_attachment" {
  name       = "s3-replication-attachment-s3-documents"
  roles      = ["${aws_iam_role.replication_role.name}"]
  policy_arn = "${aws_iam_policy.replication_policy.arn}"
}
