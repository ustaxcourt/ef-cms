resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = "db.t4g.small"
  db_name              = "${var.environment}_dawson"
  username             = var.postgres_username
  password             = var.postgres_password
  parameter_group_name = aws_db_parameter_group.postgres.name
  # vpc_security_group_ids = [aws_security_group.db.id]
  skip_final_snapshot = true
}

resource "aws_db_parameter_group" "postgres" {
  name   = "postgres"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

# TODO Additional resources

# resource "aws_db_subnet_group" "postgres" {
#   name       = "main-subnet-group"
#   subnet_ids = [aws_subnet.private.id]

#   tags = {
#     Name = "main-subnet-group"
#   }
# }

# resource "aws_security_group" "postgres" {
#   vpc_id = aws_vpc.main.id

#   ingress {
#     from_port   = 3306
#     to_port     = 3306
#     protocol    = "tcp"
#     cidr_blocks = ["your-ip-address/32"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "db-security-group"
#   }
# }

# resource "aws_route_table_association" "public" {
#   subnet_id      = aws_subnet.public.id
#   route_table_id = aws_route_table.public.id
# }

# # Create a VPC
# resource "aws_vpc" "main" {
#   cidr_block           = "10.0.0.0/16"
#   enable_dns_support   = true
#   enable_dns_hostnames = true

#   tags = {
#     Name = "main-vpc"
#   }
# }

# resource "aws_subnet" "postgres-public" {
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = "10.0.1.0/24"
#   map_public_ip_on_launch = true
#   availability_zone       = "your-region-a"

#   tags = {
#     Name = "public-subnet"
#   }
# }


# resource "aws_subnet" "postgres-private" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.2.0/24"
#   availability_zone = "your-region-a"

#   tags = {
#     Name = "private-subnet"
#   }
# }

# resource "aws_internet_gateway" "postgres" {
#   vpc_id = aws_vpc.postgres.id
# }

# resource "aws_route_table" "postgres" {
#   vpc_id = aws_vpc.postgres.id

#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.postgres.id
#   }
# }
