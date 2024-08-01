
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.environment}-vpc"
  }
}

resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.vpc.id 
  cidr_block              = "10.0.3.0/24"   
  availability_zone       = var.zones   
  map_public_ip_on_launch = true            

  tags = {
    Name = "${var.environment}-subnet"
  }
}

resource "aws_db_subnet_group" "group" {
  name       = "${var.environment}-group"
  subnet_ids = [aws_subnet.subnet.id]

  tags = {
    Name = "${var.environment}-group"
  }
}