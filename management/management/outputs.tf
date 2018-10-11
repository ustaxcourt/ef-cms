output "bastion_public_ip" {
  value = "${module.management.bastion_public_ip}"
}

output "jenkins_elb_dns" {
  value = "${module.management.jenkins_elb_dns}"
}

output "sonarqube_elb_dns" {
  value = "${module.management.sonarqube_elb_dns}"
}

output "jenkins_elb_url" {
  value = "https://${module.management.jenkins_elb_dns}/jenkins/"
}

output "sonarqube_elb_url" {
  value = "https://${module.management.sonarqube_elb_dns}/"
}

output "ecr_repository_url" {
  value = "${module.management.ecr_repository_url}"
}

output "jenkins_private_ip" {
  value = "${module.management.jenkins_private_ip}"
}

output "sonarqube_private_ip" {
  value = "${module.management.sonarqube_private_ip}"
}
