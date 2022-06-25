locals {
  index = 0
}

resource "aws_vpc" "secure_store_vpc" {
  count                = var.create_module
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
  count  = var.create_module
  vpc_id = aws_vpc.secure_store_vpc[local.index].id
  tags = {
    Name        = "secure-store${var.env}-igw"
    Environment = "${var.env}"
  }
}

# Public subnet
resource "aws_subnet" "secure_store_public_subnet" {
  vpc_id                  = aws_vpc.secure_store_vpc[local.index].id
  count                   = (var.create_module == 1) ? length(var.public_subnets_cidr) : 0
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
  count  = var.create_module
  vpc_id = aws_vpc.secure_store_vpc[local.index].id

  tags = {
    Name        = "secure-store-${var.env}-public-route-table"
    Environment = "${var.env}"
  }
}

# Route for Internet Gateway
resource "aws_route" "secure_store_public_internet_gateway" {
  count                  = var.create_module
  route_table_id         = aws_route_table.secure_store_public[local.index].id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.secure_store_ig[local.index].id
}


# Route table associations for Public Subnets
resource "aws_route_table_association" "public" {
  count          = (var.create_module == 1) ? length(var.public_subnets_cidr) - 1 : 0
  subnet_id      = element(aws_subnet.secure_store_public_subnet.*.id, count.index)
  route_table_id = aws_route_table.secure_store_public[local.index].id
}


resource "aws_security_group" "default" {
  count                  = var.create_module
  name        = "secure-store${var.env}-default-sg"
  description = "Default SG to alllow traffic from the VPC"
  vpc_id      = aws_vpc.secure_store_vpc[count.index].id
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
  value = var.create_module == 1 ? aws_vpc.secure_store_vpc[local.index].id : ""
}

output "subnet" {
  value = aws_subnet.secure_store_public_subnet
}
