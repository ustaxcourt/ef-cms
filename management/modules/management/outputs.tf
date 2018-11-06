output "ecs_role_arn" {
  value = "${aws_iam_role.ecs_role.arn}"
}

output "jenkins_private_ip" {
  description = "The private IP address assigned to the jenkins instance"
  value       = "${join("", aws_instance.jenkins_web.*.private_ip)}"
}

output "bastion_public_ip" {
  description = "The public IP address assigned to the bastion instance"
  value       = "${join("", aws_instance.bastion_host.*.public_ip)}"
}

output "jenkins_elb_dns" {
  description = "The public IP address assigned to the jenkins elb"
  value       = "${aws_elb.jenkins_elb.dns_name}"
}