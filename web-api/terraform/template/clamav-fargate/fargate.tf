# Networking for Fargate
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "all" {
  vpc_id = data.aws_vpc.default.id
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "clamav_fargate_execution_${var.environment}"

  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_role" "ecs_task_role" {
  name = "clamav_fargate_task_${var.environment}"

  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "s3_task" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_ecs_cluster" "cluster" {
  name = "clamav_fargate_cluster_${var.environment}"
}

resource "aws_ecs_task_definition" "definition" {
  family                   = "clamav_fargate_task_${var.environment}"
  task_role_arn            = var.ecs_task_role
  execution_role_arn       = var.ecs_task_execution_role
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  requires_compatibilities = ["FARGATE"]

  container_definitions = <<DEFINITION
[
  {
    "image": "${data.aws_caller_identity.current.account_id}.dkr.ecr.us-east-1.amazonaws.com/project:latest",
    "name": "project-container",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-region" : "us-east-1",
            "awslogs-group" : "/aws/ecs/clamav_fargate_${var.environment}",
            "awslogs-stream-prefix" : "project"
        }
    },
    "environment": [
      {
        "name": "SQS_QUEUE_URL",
        "value": "${aws_event_queue.clamav_event_queue.url}"
      },
      {
        "name": "QUARANTINE_BUCKET",
        "value": "${aws_s3_bucket.quarantine_bucket.bucket_domain_name}"
      },
      {
        "name": "CLEAN_BUCKET",
        "value": "${var.dns_domain}-documents-${var.environment}-us-east-1"
      }
    ]
  }
]
DEFINITION

  depends_on = [
    aws_iam_role.ecs_task_role,
    aws_iam_role.ecs_task_execution_role,
    aws_s3_bucket.quarantine_bucket,
    aws_event_queue.clamav_event_queue
  ]
}
