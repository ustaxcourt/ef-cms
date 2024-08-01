
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.environment}-vpc"
  }
}

resource "aws_subnet" "subnet_a" {
  vpc_id                  = aws_vpc.vpc.id 
  cidr_block              = "10.0.5.0/24"
  availability_zone       = var.zone_a
  map_public_ip_on_launch = true
}


resource "aws_subnet" "subnet_b" {
  vpc_id                  = aws_vpc.vpc.id 
  cidr_block              = "10.0.4.0/24"
  availability_zone       = var.zone_b
  map_public_ip_on_launch = true
}


resource "aws_db_subnet_group" "group" {
  name       = "${var.environment}-group"
  subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]

  tags = {
    Name = "${var.environment}-group"
  }
}