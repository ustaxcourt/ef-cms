output "vpc_id" {
  value       = "${aws_vpc.main.id}"
  description = "The ID of the VPC created."
}

output "public_subnets" {
  value       = ["${aws_subnet.public.*.id}"]
  description = "A list of IDs of the public subnets created."
}

output "private_subnets" {
  value       = ["${aws_subnet.private.*.id}"]
  description = "A list of IDs of the private subnets created."
}
