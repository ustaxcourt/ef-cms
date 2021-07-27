# Flow: S3 -> Event Notification -> SQS -> Fargate Task: Consume SQS & Scan -> tag

# data "aws_caller_identity" "current" {}

# data "aws_s3_bucket" "quarantine_bucket" {
#   bucket = "${var.dns_domain}-quarantine-${var.environment}-us-east-1"
# }

# # SQS
# resource "aws_sqs_queue" "clamav_event_queue" {
#   name = "s3_clamav_event_${var.environment}"

#   policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": "*",
#       "Action": ["sqs:SendMessage", "sqs:ReceiveMessage"],
#       "Resource": "arn:aws:sqs:*:*:s3_clamav_event_${var.environment}",
#       "Condition": {
#         "ArnEquals": { "aws:SourceArn": "${data.aws_s3_bucket.quarantine_bucket.arn}" }
#       }
#     }
#   ]
# }
# POLICY
# }

# resource "aws_s3_bucket_notification" "bucket_notification" {
#   bucket = data.aws_s3_bucket.quarantine_bucket.id

#   queue {
#     queue_arn = aws_sqs_queue.clamav_event_queue.arn
#     events    = ["s3:ObjectCreated:*"]
#   }
# }

# # Networking for Fargate
# # Note: 10.0.0.0 and 10.0.2.0 are private IPs
# # Required via https://stackoverflow.com/a/66802973/1002357
# # """
# # > Launch tasks in a private subnet that has a VPC routing table configured to route outbound
# # > traffic via a NAT gateway in a public subnet. This way the NAT gateway can open a connection
# # > to ECR on behalf of the task.
# # """
# # If this networking configuration isn't here, this error happens in the ECS Task's "Stopped reason":
# # ResourceInitializationError: unable to pull secrets or registry auth: pull command failed: : signal: killed
# resource "aws_vpc" "clamav_vpc" {
#   cidr_block = "10.0.0.0/16"
# }

# resource "aws_subnet" "private" {
#   vpc_id     = aws_vpc.clamav_vpc.id
#   cidr_block = "10.0.2.0/24"
# }

# resource "aws_subnet" "public" {
#   vpc_id     = aws_vpc.clamav_vpc.id
#   cidr_block = "10.0.1.0/24"
# }

# resource "aws_route_table" "private" {
#   vpc_id = aws_vpc.clamav_vpc.id
# }

# resource "aws_route_table" "public" {
#   vpc_id = aws_vpc.clamav_vpc.id
# }

# resource "aws_route_table_association" "public_subnet" {
#   subnet_id      = aws_subnet.public.id
#   route_table_id = aws_route_table.public.id
# }

# resource "aws_route_table_association" "private_subnet" {
#   subnet_id      = aws_subnet.private.id
#   route_table_id = aws_route_table.private.id
# }

# resource "aws_eip" "nat" {
#   vpc = true
# }

# resource "aws_internet_gateway" "igw" {
#   vpc_id = aws_vpc.clamav_vpc.id
# }

# resource "aws_nat_gateway" "ngw" {
#   subnet_id     = aws_subnet.public.id
#   allocation_id = aws_eip.nat.id

#   depends_on = [aws_internet_gateway.igw]
# }

# resource "aws_route" "public_igw" {
#   route_table_id         = aws_route_table.public.id
#   destination_cidr_block = "0.0.0.0/0"
#   gateway_id             = aws_internet_gateway.igw.id
# }

# resource "aws_route" "private_ngw" {
#   route_table_id         = aws_route_table.private.id
#   destination_cidr_block = "0.0.0.0/0"
#   nat_gateway_id         = aws_nat_gateway.ngw.id
# }


# resource "aws_security_group" "egress-all" {
#   name        = "egress_all"
#   description = "Allow all outbound traffic"
#   vpc_id      = aws_vpc.clamav_vpc.id

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_iam_role" "ecs_task_execution_role" {
#   name = "clamav_fargate_execution_${var.environment}"

#   assume_role_policy = <<EOF
# {
#  "Version": "2012-10-17",
#  "Statement": [
#    {
#      "Action": "sts:AssumeRole",
#      "Principal": {
#        "Service": "ecs-tasks.amazonaws.com"
#      },
#      "Effect": "Allow",
#      "Sid": ""
#    }
#  ]
# }
# EOF
# }

# resource "aws_iam_role" "ecs_task_role" {
#   name = "clamav_fargate_task_${var.environment}"

#   assume_role_policy = <<EOF
# {
#  "Version": "2012-10-17",
#  "Statement": [
#    {
#      "Action": "sts:AssumeRole",
#      "Principal": {
#        "Service": "ecs-tasks.amazonaws.com"
#      },
#      "Effect": "Allow",
#      "Sid": ""
#    }
#  ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy_attachment" {
#   role       = aws_iam_role.ecs_task_execution_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }

# resource "aws_iam_role_policy_attachment" "s3_task" {
#   role       = aws_iam_role.ecs_task_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
# }

# resource "aws_iam_role_policy_attachment" "sqs_task" {
#   role       = aws_iam_role.ecs_task_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
# }

# resource "aws_ecs_cluster" "cluster" {
#   name = "clamav_fargate_cluster_${var.environment}"

#   capacity_providers = ["FARGATE"]
# }

# data "template_file" "task_consumer_east" {
#   template = file("clamav_container_definition.json")

#   vars = {
#     aws_account_id = data.aws_caller_identity.current.account_id
#     environment    = var.environment
#     region         = "us-east-1"
#     dns_domain     = var.dns_domain
#   }
# }

# resource "aws_ecs_task_definition" "definition" {
#   family                   = "clamav_fargate_task_${var.environment}"
#   task_role_arn            = aws_iam_role.ecs_task_role.arn
#   execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
#   network_mode             = "awsvpc"
#   cpu                      = "512"
#   memory                   = "2048"
#   requires_compatibilities = ["FARGATE"]

#   container_definitions = data.template_file.task_consumer_east.rendered

#   depends_on = [
#     aws_iam_role.ecs_task_role,
#     aws_iam_role.ecs_task_execution_role
#   ]
# }

# resource "aws_ecs_service" "clamav_service" {
#   name            = "clamav_service_${var.environment}"
#   cluster         = aws_ecs_cluster.cluster.id
#   task_definition = aws_ecs_task_definition.definition.arn
#   desired_count   = 1
#   launch_type     = "FARGATE"

#   network_configuration {
#     assign_public_ip = false

#     subnets = [
#       aws_subnet.private.id
#     ]

#     security_groups = [
#       aws_security_group.egress-all.id
#     ]
#   }
# }
