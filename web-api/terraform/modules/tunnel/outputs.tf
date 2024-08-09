
output "instance_public_ip" {
  value = aws_instance.tunnel_instance.public_ip
  description = "Public IP address of the EC2 instance"
}

output "instance_private_ip" {
  value = aws_instance.tunnel_instance.private_ip
  description = "Private IP address of the EC2 instance"
}

output "tunnel_security_group_id" {
  value = aws_security_group.tunnel_sg.id
}