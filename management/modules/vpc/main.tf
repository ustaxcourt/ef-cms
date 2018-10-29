resource "aws_vpc" "main" {
  cidr_block = "172.31.0.0/16"

  tags {
    Name        = "${var.environment}-${var.deployment} VPC"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public" {
  count = "${var.number_of_subnets}"

  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 4, count.index)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"

  map_public_ip_on_launch = true

  tags {
    Name        = "public-${var.environment}-${var.deployment}-${count.index}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_subnet" "private" {
  count = "${var.number_of_subnets}"

  cidr_block        = "${cidrsubnet(aws_vpc.main.cidr_block, 4, length(aws_subnet.public.*.id) + count.index)}"
  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  vpc_id            = "${aws_vpc.main.id}"

  map_public_ip_on_launch = false

  tags {
    Name        = "private-${var.environment}-${var.deployment}-${count.index}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_internet_gateway" "internet" {
  vpc_id = "${aws_vpc.main.id}"

  tags {
    Name        = "internet-gateway-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.main.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.internet.id}"
}

resource "aws_eip" "elastic_ip" {
  vpc        = true
  depends_on = ["aws_internet_gateway.internet"]
}

resource "aws_nat_gateway" "private_nat" {
  subnet_id     = "${element(aws_subnet.public.*.id, 0)}"
  allocation_id = "${aws_eip.elastic_ip.id}"
}

resource "aws_route_table" "private_route" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.private_nat.id}"
  }

  tags {
    Name        = "private-subnets-${var.environment}-${var.deployment}"
    environment = "${var.environment}"
    deployment  = "${var.deployment}"
  }
}

resource "aws_route_table_association" "private_association" {
  count = "${var.number_of_subnets}"

  subnet_id      = "${element(aws_subnet.private.*.id, count.index)}"
  route_table_id = "${aws_route_table.private_route.id}"
}
