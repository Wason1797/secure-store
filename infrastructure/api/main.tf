terraform {
  required_providers {

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
  }
}

resource "aws_ecr_repository" "secure_store_ecr" {
  count = var.create_module
  name  = "secure_store_ecr_repo"

}


resource "docker_registry_image" "backend" {
  count = var.create_module
  name  = "${aws_ecr_repository.secure_store_ecr[0].repository_url}:latest"

  build {
    context    = "../api"
    dockerfile = "Dockerfile"
  }
}


resource "aws_security_group" "secure_store_ec2_sg" {
  count       = var.create_module
  name        = "secure-store${var.env}-ec2-sg"
  description = "Default SG for ec2 instances"
  vpc_id      = var.vpc_id

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

resource "aws_instance" "secure_store_api_instance" {
  count = var.create_module

  depends_on = [
    docker_registry_image.backend
  ]

  ami                    = "ami-052efd3df9dad4825"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.secure_store_ec2_sg[count.index].id]
  subnet_id              = element(var.subnet.*.id, 1)

  user_data = <<EOF

  EOF

  tags = {
    Name = "secure store api instance"

  }

}


output "ec2_instance_id" {
  value = var.create_module == 1 ? aws_instance.secure_store_api_instance[0].id : ""
}
