#####
# VPC and subnets
#####
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "all" {
  vpc_id = data.aws_vpc.default.id
}

#####
# ALB
#####
module "alb" {
  source  = "umotif-public/alb/aws"
  version = "~> 2.0"

  name_prefix        = "clamav_fargate_lb_${var.environment}"
  load_balancer_type = "application"
  internal           = false
  vpc_id             = data.aws_vpc.default.id
  subnets            = data.aws_subnet_ids.all.ids
}

resource "aws_lb_listener" "alb_80" {
  load_balancer_arn = module.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = module.fargate.target_group_arn[0]
  }
}

#####
# Security Group Config
#####
resource "aws_security_group_rule" "alb_ingress_80" {
  security_group_id = module.alb.security_group_id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "task_ingress_80" {
  security_group_id        = module.fargate.service_sg_id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 80
  to_port                  = 80
  source_security_group_id = module.alb.security_group_id
}

#####
# ECS cluster and fargate
#####
resource "aws_ecs_cluster" "clamav_ecs_cluster" {
  name               = "clamav_fargate_cluster_${var.environment}"
  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
  }

  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

module "fargate" {
  source = "umotif-public/ecs-fargate/aws"
  version = "~> 6.1.0"
  
  name_prefix        = "clamav_fargate_${var.environment}"
  vpc_id             = data.aws_vpc.default.id
  private_subnet_ids = data.aws_subnet_ids.all.ids
  cluster_id         = aws_ecs_cluster.cluster.id

  platform_version = "1.4.0"

  task_container_image   = "${data.aws_caller_identity.current.account_id}.dkr.ecr.us-east-1.amazonaws.com/clamav_spike:latest"
  task_definition_cpu    = 256
  task_definition_memory = 512

  task_container_port             = 80
  task_container_assign_public_ip = true

  target_groups = [
    {
      target_group_name = "clamav_target_group_${var.environment}"
      container_port    = 80
    }
  ]

  capacity_provider_strategy = [
    {
      capacity_provider = "FARGATE",
      weight            = 100
    }
  ]

  task_stop_timeout = 90

  depends_on = [
    module.alb
  ]
}
