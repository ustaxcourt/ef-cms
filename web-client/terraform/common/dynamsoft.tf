# provider "aws" {
#   region = "us-east-1"
#   alias = "us-east-1"
# }

# provider "aws" {
#   region = "us-west-1"
#   alias = "us-west-1"
# }


# resource "aws_instance" "dynamsoft" {
#   ami           = "ami-0a313d6098716f372"
#   instance_type = "t2.nano"

#   key_name = "dynamsoft"

#   # subnet_id              = "${element(aws_vpc.main.public_subnets, 0)}"
#   # vpc_security_group_ids = ["${aws_security_group.dynamsoft.id}"]
#   security_groups = ["${aws_security_group.dynamsoft.name}"]

#   # iam_instance_profile = "${aws_iam_instance_profile.environment_deployer_profile.name}"

#   tags {
#     Name        = "dynamsoft-${var.environment}"
#     environment = "${var.environment}"
#   }

#   provisioner "remote-exec" {
#     inline = [
#       "sudo apt update",
#       "sudo apt install -y nginx",
#       "sudo ufw allow 'Nginx HTTP'",
#     ]

#     connection {
#       private_key  = "${file("ssh/id_rsa")}"
#       host = "${aws_instance.dynamsoft.public_ip}"
#       user = "ubuntu"
#     }
#   }

#   provisioner "file" {
#     source      = "Resources"
#     destination = "/var/www/html"

#     connection {
#       private_key  = "${file("ssh/id_rsa")}"
#       host = "${aws_instance.dynamsoft.public_ip}"
#       user = "ubuntu"
#     }
#   }
# }

# resource "aws_security_group" "dynamsoft" {
#   name        = "dynamsoft-${var.environment}"
#   description = "Allow access to dynamsoft"

#   # vpc_id = "${aws_vpc.main.vpc_id}"

#   tags {
#     Name        = "dynamsoft-${var.environment}"
#     environment = "${var.environment}"
#   }
# }

# resource "aws_security_group_rule" "dynamsoft_egress" {
#   type        = "egress"
#   from_port   = 0
#   to_port     = 0
#   protocol    = "-1"
#   cidr_blocks = ["0.0.0.0/0"]
#   security_group_id = "${aws_security_group.dynamsoft.id}"
# }

# resource "aws_security_group_rule" "dynamsoft_http_ingress" {
#   type                     = "ingress"
#   from_port                = 80
#   to_port                  = 80
#   protocol                 = "tcp"
#   # cidr_blocks = ["0.0.0.0/0"]
#   source_security_group_id = "${aws_security_group.dynamsoft_load_balancer_security_group.id}"
#   security_group_id        = "${aws_security_group.dynamsoft.id}"
# }

# resource "aws_security_group_rule" "dynamsoft_https_ingress" {
#   type                     = "ingress"
#   from_port                = 443
#   to_port                  = 443
#   protocol                 = "tcp"
#   # cidr_blocks = ["0.0.0.0/0"]
#   source_security_group_id = "${aws_security_group.dynamsoft_load_balancer_security_group.id}"
#   security_group_id        = "${aws_security_group.dynamsoft.id}"
# }

# resource "aws_security_group_rule" "dynamsoft_ssh_ingress" {
#   type                     = "ingress"
#   from_port                = 22
#   to_port                  = 22
#   protocol                 = "tcp"
#   cidr_blocks = ["0.0.0.0/0"]
#   # source_security_group_id = "${aws_security_group.bastion_host_security_group.id}"
#   security_group_id        = "${aws_security_group.dynamsoft.id}"
# }


# resource "aws_security_group" "dynamsoft_load_balancer_security_group" {
#   name        = "dynamsoft-load-balancer-${var.environment}"
#   description = "dynamsoft-load-balancer-security-group"
#   # vpc_id      = "${aws_vpc.main.vpc_id}"

#   ingress {
#     from_port   = "443"
#     to_port     = "443"
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   lifecycle {
#     create_before_destroy = true
#   }

#   tags {
#     Name        = "dynamsoft-elb-${var.environment}"
#     environment = "${var.environment}"
#   }
# }


# # resource "aws_acm_certificate" "dynamsoft_cert" {
# #   domain_name       = "dynamsoft-${var.environment}.${var.dns_domain}"
# #   validation_method = "DNS"
# # }

# resource "aws_elb" "dynamsoft_elb" {
#   name            = "dynamsoft-elb-${var.environment}"
#   # subnets         = ["${element(aws_vpc.main.public_subnets, 0)}"]
#   availability_zones = ["us-east-1a"]
#   security_groups = ["${aws_security_group.dynamsoft_load_balancer_security_group.id}"]

#   listener {
#     instance_port      = 80
#     instance_protocol  = "http"
#     lb_port            = 443
#     lb_protocol        = "https"
#     ssl_certificate_id = "${module.dynamsoft-certificate.acm_certificate_arn}"
#   }

#   health_check {
#     healthy_threshold   = 2
#     unhealthy_threshold = 2
#     timeout             = 3
#     target              = "HTTP:80/"
#     interval            = 30
#   }

#   instances                   = ["${aws_instance.dynamsoft.id}"]
#   cross_zone_load_balancing   = false
#   idle_timeout                = 400
#   connection_draining         = true
#   connection_draining_timeout = 400

#   tags {
#     Name        = "dynamsoft-elb-${var.environment}"
#     environment = "${var.environment}"
#   }
# }

# resource "aws_route53_record" "dynamsoft_www" {
#   zone_id = "${data.aws_route53_zone.zone.zone_id}"
#   name    = "dynamsoft-${var.environment}.${var.dns_domain}"
#   type    = "A"

#   alias {
#     name                   = "${aws_elb.dynamsoft_elb.dns_name}"
#     zone_id                = "${aws_elb.dynamsoft_elb.zone_id}"
#     evaluate_target_health = true
#   }
# }


# module "dynamsoft-certificate" {
#   source = "github.com/traveloka/terraform-aws-acm-certificate?ref=v0.1.2"

#   domain_name            = "dynamsoft-${var.environment}.${var.dns_domain}"
#   hosted_zone_name       = "${var.dns_domain}."
#   is_hosted_zone_private = "false"
#   validation_method      = "DNS"
#   certificate_name       = "dynamsoft-${var.environment}.${var.dns_domain}"
#   environment            = "${var.environment}"
#   description            = "Certificate for dynamsoft-${var.environment}.${var.dns_domain}"
#   product_domain         = "EFCMS"
# }