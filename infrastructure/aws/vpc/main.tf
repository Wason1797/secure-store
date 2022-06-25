resource "aws_vpc" "secure_store_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "secure-store-${var.env}-vpc"
    Environment = "${var.env}"
  }
}

# Subnets
# Internet Gateway for Public Subnet
resource "aws_internet_gateway" "secure_store_ig" {
  vpc_id = aws_vpc.secure_store_vpc.id
  tags = {
    Name        = "secure-store${var.env}-igw"
    Environment = "${var.env}"
  }
}

# Public subnet
resource "aws_subnet" "secure_store_public_subnet" {
  vpc_id                  = aws_vpc.secure_store_vpc.id
  count                   = length(var.public_subnets_cidr)
  cidr_block              = element(var.public_subnets_cidr, count.index)
  availability_zone       = element(var.availability_zones, count.index)
  map_public_ip_on_launch = false

  tags = {
    Name        = "secure-store-${var.env}-${element(var.availability_zones, count.index)}-public-subnet"
    Environment = "${var.env}"
  }
}

# Routing tables to route traffic for Public Subnet
resource "aws_route_table" "secure_store_public" {
  vpc_id = aws_vpc.secure_store_vpc.id

  tags = {
    Name        = "secure-store-${var.env}-public-route-table"
    Environment = "${var.env}"
  }
}

# Route for Internet Gateway
resource "aws_route" "secure_store_public_internet_gateway" {
  route_table_id         = aws_route_table.secure_store_public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.secure_store_ig.id
}


# Route table associations for Public Subnets
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets_cidr) - 1
  subnet_id      = element(aws_subnet.secure_store_public_subnet.*.id, count.index)
  route_table_id = aws_route_table.secure_store_public.id
}


resource "aws_security_group" "default" {
  name        = "secure-store${var.env}-default-sg"
  description = "Default SG to alllow traffic from the VPC"
  vpc_id      = aws_vpc.secure_store_vpc.id
  depends_on = [
    aws_vpc.secure_store_vpc
  ]

  ingress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port = "0"
    to_port   = "0"
    protocol  = "-1"
    self      = "true"
  }

  tags = {
    Environment = "${var.env}"
  }
}


output "vpc_id" {
  value = aws_vpc.secure_store_vpc.id
}

output "subnet" {
  value = aws_subnet.secure_store_public_subnet
}
