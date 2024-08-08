data "aws_key_pair" "existing_key" {
  key_name = var.public_key_name
}

# Define a security group for the EC2 instance
resource "aws_security_group" "tunnel_sg" {
  name        = "tunnel-security-group"
  description = "Allow SSH access for tunneling"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Define an EC2 instance
resource "aws_instance" "tunnel_instance" {
  ami           = "ami-0ae8f15ae66fe8cda" 
  instance_type = "t2.micro" 
  key_name      = data.aws_key_pair.existing_key.key_name
  security_groups = [aws_security_group.tunnel_sg.id]
  subnet_id     = var.subnet_id
}
