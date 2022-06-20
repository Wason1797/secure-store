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

locals {
  ecr_repo_url            = aws_ecr_repository.secure_store_ecr[0].repository_url
  secure_store_image_name = "${aws_ecr_repository.secure_store_ecr[0].repository_url}:latest"
}


resource "docker_registry_image" "api" {
  count = var.create_module
  name  = local.secure_store_image_name

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
  ingress {
    from_port       = "5000"
    to_port         = "5000"
    protocol        = "tcp"
    security_groups = [var.alb_sg_group_id]
  }

  egress {
    from_port   = "0"
    to_port     = "0"
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = "${var.env}"
  }
}



resource "aws_iam_role" "secure_store_iam_ec2_role" {
  name = "secure_store_iam_ec2_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "ec2.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
    }
  )

}


resource "aws_iam_role_policy" "secure_store_iam_policy" {
  name = "secure_store_iam_policy"
  role = aws_iam_role.secure_store_iam_ec2_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Effect" : "Allow",
      "Action" : "secretsmanager:GetSecretValue",
      "Resource" : "${var.secrets_manager.arn}"
      },
      {
        "Sid" : "GrantSingleImageReadOnlyAccess",
        "Effect" : "Allow",
        "Action" : [
          "ecr:DescribeImageScanFindings",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImageReplicationStatus",
          "ecr:DescribeRepositories",
          "ecr:ListTagsForResource",
          "ecr:BatchGetRepositoryScanningConfiguration",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetRepositoryPolicy",
          "ecr:GetLifecyclePolicy"
        ],
        "Resource" : "${aws_ecr_repository.secure_store_ecr[0].arn}"
      },
      {
        "Sid" : "GrantECRAuthAccess",
        "Effect" : "Allow",
        "Action" : [
          "ecr:GetRegistryPolicy",
          "ecr:DescribeRegistry",
          "ecr:GetAuthorizationToken",
          "ecr:GetRegistryScanningConfiguration"
        ],
        "Resource" : "*"
    }]
  })
}

resource "aws_iam_instance_profile" "secure_store_instance_profile" {
  name = "secure_store_instance_profile"
  role = aws_iam_role.secure_store_iam_ec2_role.name
}

resource "aws_instance" "secure_store_api_instance" {
  count = var.create_module

  depends_on = [
    docker_registry_image.api
  ]

  ami                    = "ami-0729e439b6769d6ab"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.secure_store_ec2_sg[count.index].id]
  subnet_id              = element(var.subnet.*.id, 0) # change back to 1
  key_name               = "test-key"
  iam_instance_profile   = aws_iam_instance_profile.secure_store_instance_profile.name

  user_data = <<EOF
${file("${path.module}/install.sh")}
aws secretsmanager get-secret-value \
  --region ${var.region} \
  --secret-id ${var.secrets_manager.id} \
  --query SecretString \
  --output text \
  | tee secrets.json
echo -E "${file("${path.module}/create_env.py")}" >> create_env.py
python3 create_env.py
aws ecr get-login-password \
  --region ${var.region} \
  | docker login \
  --username AWS \
  --password-stdin \
  ${local.ecr_repo_url}
docker pull ${local.secure_store_image_name}
docker run --env-file ./.env -p "5000:5000" -d ${local.secure_store_image_name}
EOF
  tags = {
    Name = "secure store api instance"

  }

}


output "ec2_instance_id" {
  value = var.create_module == 1 ? aws_instance.secure_store_api_instance[0].id : ""
}

output "ec2_sg_id" {
  value = var.create_module == 1 ? aws_security_group.secure_store_ec2_sg[0].id : ""
}
