output "bastion_public_ip" {
  value = "${module.management.bastion_public_ip}"
}

output "jenkins_elb_dns" {
  value = "${module.management.jenkins_elb_dns}"
}

output "jenkins_elb_url" {
  value = "https://${module.management.jenkins_elb_dns}/jenkins/"
}

output "jenkins_private_ip" {
  value = "${module.management.jenkins_private_ip}"
}

output "dns_domain" {
  value = "${var.dns_domain}"
}