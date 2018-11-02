resource "aws_instance" "bastion_host" {
  tags {
    Name        = "bastion-host-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }

  subnet_id                   = "${element(module.vpc.public_subnets, 0)}"
  ami                         = "${data.aws_ami.ubuntu.id}"
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  vpc_security_group_ids      = ["${aws_security_group.bastion_host_security_group.id}"]
  key_name                    = "${var.environment}-${var.deployment}-management"
}

resource "aws_security_group" "bastion_host_security_group" {
  tags {
    Name        = "bastion-host-security-group-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }

  vpc_id = "${module.vpc.vpc_id}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = "${var.ssh_cidrs}"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}
