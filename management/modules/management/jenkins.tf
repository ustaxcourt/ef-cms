resource "aws_instance" "jenkins_web" {
  ami           = "${data.aws_ami.jenkins.id}"
  instance_type = "${var.jenkins_instance_type}"

  key_name = "${var.environment}-${var.deployment}-management"

  subnet_id              = "${element(module.vpc.public_subnets, 0)}"
  vpc_security_group_ids = ["${aws_security_group.jenkins.id}"]

  iam_instance_profile = "${aws_iam_instance_profile.environment_deployer_profile.name}"

  tags {
    Name        = "jenkins-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }

  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo usermod -a -G docker tomcat",
      "sudo sed -i -e 's|ExecStart=.*|ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375|' /lib/systemd/system/docker.service",
      "sudo systemctl daemon-reload",
      "sudo service docker restart",
    ]

    connection {
      bastion_host = "${aws_instance.bastion_host.public_ip}"
      bastion_user = "ubuntu"
      private_key  = "${file("ssh/id_rsa")}"

      host = "${aws_instance.jenkins_web.private_ip}"
      user = "bitnami"
    }
  }
}

resource "aws_security_group" "jenkins" {
  name        = "jenkins-${var.environment}-${var.deployment}"
  description = "Allow access to Jenkins"

  vpc_id = "${module.vpc.vpc_id}"

  tags {
    Name        = "jenkins-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_security_group_rule" "jenkins_egress" {
  type        = "egress"
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.jenkins.id}"
}

resource "aws_security_group_rule" "jenkins_http_ingress" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.jenkins_load_balancer_security_group.id}"
  security_group_id        = "${aws_security_group.jenkins.id}"
}

resource "aws_security_group_rule" "jenkins_https_ingress" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.jenkins_load_balancer_security_group.id}"
  security_group_id        = "${aws_security_group.jenkins.id}"
}

resource "aws_security_group_rule" "jenkins_ssh_ingress" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.bastion_host_security_group.id}"
  security_group_id        = "${aws_security_group.jenkins.id}"
}

data "aws_ami" "jenkins" {
  most_recent = true

  filter {
    name   = "name"
    values = ["bitnami-jenkins-*-ubuntu-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Create a new load balancer

resource "aws_security_group" "jenkins_load_balancer_security_group" {
  name        = "jenkins-load-balancer-${var.environment}-${var.deployment}"
  description = "jenkins-load-balancer-security-group"
  vpc_id      = "${module.vpc.vpc_id}"

  ingress {
    from_port   = "443"
    to_port     = "443"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags {
    Name        = "jenkins-elb-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_elb" "jenkins_elb" {
  name            = "jenkins-elb-${var.environment}-${var.deployment}"
  subnets         = ["${element(module.vpc.public_subnets, 0)}"]
  security_groups = ["${aws_security_group.jenkins_load_balancer_security_group.id}"]

  listener {
    instance_port      = 80
    instance_protocol  = "http"
    lb_port            = 443
    lb_protocol        = "https"
    ssl_certificate_id = "${module.jenkins-certificate.acm_certificate_arn}"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    target              = "HTTP:80/jenkins/login"
    interval            = 30
  }

  instances                   = ["${aws_instance.jenkins_web.id}"]
  cross_zone_load_balancing   = false
  idle_timeout                = 400
  connection_draining         = true
  connection_draining_timeout = 400

  tags {
    Name        = "jenkins-elb-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

module "jenkins-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate?ref=v0.1.1"

  domain_name            = "jenkins-${var.environment}-${var.deployment}.${var.dns_domain}"
  hosted_zone_name       = "${data.aws_route53_zone.aws_route53_zone.name}"
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "jenkins-${var.environment}-${var.deployment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for jenkins-${var.environment}-${var.deployment}.${var.dns_domain}"
  product_domain         = "CMS"
}

resource "aws_route53_record" "jenkins_www" {
  zone_id = "${data.aws_route53_zone.aws_route53_zone.zone_id}"
  name    = "jenkins-${var.environment}-${var.deployment}.${var.dns_domain}"
  type    = "A"

  alias {
    name                   = "${aws_elb.jenkins_elb.dns_name}"
    zone_id                = "${aws_elb.jenkins_elb.zone_id}"
    evaluate_target_health = true
  }
}
