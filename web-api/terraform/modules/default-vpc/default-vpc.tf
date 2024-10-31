# Special AWS TF Lookup for Default VPC
resource "aws_default_vpc" "default" {
}

resource "aws_default_security_group" "default" {
  vpc_id = aws_default_vpc.default.id

  # Allow access to postgres rds instances via ipv4
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow access to postgres rds instances via ipv6
  ingress {
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    ipv6_cidr_blocks = ["::/0"]
  }

  # Default outbound aws vpc rule
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
