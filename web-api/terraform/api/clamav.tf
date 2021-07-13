
# Flow: S3 -> Event Notification -> SQS -> EC2 Consumption & Scan -> tag


# resource "aws_s3_bucket" "clamav_s3_download" {
#   bucket = "${var.dns_domain}-monitor-script"
#   acl    = "private"
# }

# resource "aws_s3_bucket_object" "clamav_worker_object" {
#   bucket = aws_s3_bucket.clamav_s3_download.id
#   key    = "worker.js"
#   source = "worker.js"
#   etag   = filemd5("worker.js")
# }

# resource "aws_s3_bucket_public_access_block" "clamav" {
#   bucket                  = aws_s3_bucket.clamav_s3_download.id
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }

data "aws_caller_identity" "current" {}

data "aws_s3_bucket" "quarantine_bucket" {
  bucket = "${var.dns_domain}-quarantine-${var.region}"
}

# SQS
resource "aws_sqs_queue" "clamav_event_queue" {
  name = "s3_clamav_event_${var.environment}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["sqs:SendMessage", "sqs:ReceiveMessage"],
      "Resource": "arn:aws:sqs:*:*:s3_clamav_event_${var.environment}",
      "Condition": {
        "ArnEquals": { "aws:SourceArn": "${data.aws_s3_bucket.quarantine_bucket.arn}" }
      }
    }
  ]
}
POLICY
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = data.aws_s3_bucket.quarantine_bucket.id

  queue {
    queue_arn = aws_sqs_queue.clamav_event_queue.arn
    events    = ["s3:ObjectCreated:*"]
  }
}

# ECS Fargate: see fargate.tf

# EC2
# resource "aws_instance" "clamav_worker" {
#   ami           = "ami-0a313d6098716f372"
#   instance_type = "t2.large"

#   availability_zone = "us-east-1a"

#   tags = {
#     Name        = "clamav-${var.environment}"
#     environment = var.environment
#   }

#   user_data = data.template_file.setup_clamav.rendered

#   iam_instance_profile = "clamav_s3_download_instance_profile_${var.environment}"

#   key_name = "cody for clamav"
# }

# data "template_file" "setup_clamav" {
#   template = file("setup_clamav_worker.sh")

#   vars = {
#     documents_bucket_name  = aws_s3_bucket.documents_us_east_1.id
#     sqs_queue_url          = aws_sqs_queue.clamav_event_queue.id
#     quarantine_bucket      = aws_s3_bucket.quarantine_bucket.id
#     environment            = var.environment
#     monitor_script_s3_path = "${var.dns_domain}-monitor-script"
#   }
# }

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

  capacity_providers = ["FARGATE"]
}

data "template_file" "task_consumer" {
  template = file("${path.module}/../api/consumer.json")

  vars = {
    aws_account_id = data.aws_caller_identity.current.account_id
    environment    = var.environment
    region         = var.region
    dns_domain     = var.dns_domain
  }
}

resource "aws_ecs_task_definition" "definition" {
  family                   = "clamav_fargate_task_${var.environment}"
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  requires_compatibilities = ["FARGATE"]

  container_definitions = data.template_file.task_consumer.rendered

  depends_on = [
    aws_iam_role.ecs_task_role,
    aws_iam_role.ecs_task_execution_role
  ]
}
