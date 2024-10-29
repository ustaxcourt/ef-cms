data "aws_caller_identity" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default_subnets" {
  filter {
    name   = "default-for-az"
    values = ["true"]
  }

  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_security_group" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "group-name"
    values = ["default"]
  }
}

resource "aws_iam_role" "batch_service_role" {
  name = "batch_role_${var.environment}_${var.current_color}_${var.region}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "batch.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
		{
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "batch_service_role_admin_policy" {
  role       = aws_iam_role.batch_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.batch_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "batch_service_role_policy" {
  name = "batch_service_role_policy_${var.environment}_${var.current_color}_${var.region}"
  role = aws_iam_role.batch_service_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutObject",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::${var.dns_domain}-documents-*",
                "arn:aws:s3:::${var.dns_domain}-temp-documents-*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "ecs:DeleteCluster"
            ],
            "Resource": [
                "arn:aws:ecs:us-east-1:${data.aws_caller_identity.current.account_id}:cluster/compute_environment_*",
                "arn:aws:ecs:us-west-1:${data.aws_caller_identity.current.account_id}:cluster/compute_environment_*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_batch_compute_environment" "aws_batch_compute_environment" {
  compute_environment_name = "compute_environment_${var.environment}_${var.current_color}_${var.region}"
  service_role             = aws_iam_role.batch_service_role.arn
  type                     = "MANAGED"

  compute_resources {
    type              = "FARGATE"
    max_vcpus         = 4
    subnets           = data.aws_subnets.default_subnets.ids
    security_group_ids = [data.aws_security_group.default.id]
  }
}

resource "aws_batch_job_queue" "example_aws_batch_job_queue" {
  name                 = "aws-batch-job-queue-${var.environment}-${var.current_color}-${var.region}"
  state                = "ENABLED"
  priority             = 1
  compute_environments = [aws_batch_compute_environment.aws_batch_compute_environment.arn]
}


data "aws_iam_policy_document" "ecs_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "job_definition_iam_role" {
  name               = "job_definition_iam_role_${var.environment}_${var.current_color}_${var.region}"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "job_definition_execution_role_policy" {
  role       = aws_iam_role.job_definition_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_batch_job_definition" "example_aws_batch_job_definition" {
  name       = "s3-zip-job-${var.environment}-${var.current_color}-${var.region}"
  type       = "container"


 container_properties = jsonencode({
    image      = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/docket-entry-zipper-${var.environment}-${var.current_color}-${var.region}:latest"

    fargatePlatformConfiguration = {
      platformVersion = "LATEST"
    }

    resourceRequirements = [
      {
        type  = "VCPU"
        value = "4"
      },
      {
        type  = "MEMORY"
        value = "8192"
      }
    ]

    jobRoleArn = aws_iam_role.batch_service_role.arn

    executionRoleArn = aws_iam_role.job_definition_iam_role.arn

    networkConfiguration = {
			assignPublicIp  = "ENABLED"
		}
  })

  platform_capabilities = ["FARGATE"]

  retry_strategy {
    attempts = 1
  }
}