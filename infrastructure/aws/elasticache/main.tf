resource "aws_security_group" "redis_sg" {
  vpc_id      = var.vpc_id
  name        = "secure-store-${var.env}-elasticache-sg"
  description = "SG for elasticache instances"

  ingress {
    from_port       = "6379"
    to_port         = "6379"
    protocol        = "tcp"
    security_groups = [var.ec2_sg_id]
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


resource "random_string" "auth_token" {
  length  = 64
  special = false
}

module "redis" {
  source  = "umotif-public/elasticache-redis/aws"
  version = "~> 3.0.0"

  name_prefix        = "redis"
  num_cache_clusters = 1
  node_type          = "cache.t2.micro"

  engine_version             = "6.x"
  port                       = 6379
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_string.auth_token.result

  apply_immediately = true
  family            = "redis6.x"
  description       = "secure store api cache"

  security_group_ids = [aws_security_group.redis_sg.id]
  subnet_ids         = [element(var.subnet.*.id, 0)] # change back to 0
  vpc_id             = var.vpc_id

}


output "auth_token" {
  value = random_string.auth_token.result
}


output "elasticache_url" {
  value = module.redis.elasticache_replication_group_primary_endpoint_address
}
