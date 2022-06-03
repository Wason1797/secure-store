data "aws_vpc" "default" {
  default = true
  count = var.create_module
}

data "aws_subnets" "all" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default[var.create_module - 1].id]
  }
  count = var.create_module
}

resource "aws_security_group" "redis_sg" {
  vpc_id = data.aws_vpc.default[var.create_module - 1].id
  count  = var.create_module
}

resource "random_string" "auth_token" {
  length  = 64
  special = false
}

module "redis" {
  count   = var.create_module
  source  = "umotif-public/elasticache-redis/aws"
  version = "~> 3.0.0"

  name_prefix        = "redis"
  num_cache_clusters = 1
  node_type          = "cache.t2.micro"

  engine_version            = "6.x"
  port                      = 6379
  maintenance_window        = "mon:03:00-mon:04:00"
  snapshot_window           = "04:00-06:00"
  snapshot_retention_limit  = 7
  final_snapshot_identifier = "redis-final-snapshot-name"

#   automatic_failover_enabled = true
#   multi_az_enabled           = true

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_string.auth_token.result

  apply_immediately = true
  family            = "redis6.x"
  description       = "API Cache"

  subnet_ids = data.aws_subnets.all[var.create_module -1].ids
  vpc_id     = data.aws_vpc.default[var.create_module - 1].id

  #   allowed_security_groups = [aws_security_group[var.create_module - 1].redis_sg.id]

  ingress_cidr_blocks = ["0.0.0.0/0"]

  parameter = [
    {
      name  = "repl-backlog-size"
      value = "16384"
    }
  ]

  #   log_delivery_configuration = [
  #     {
  #       destination_type = "cloudwatch-logs"
  #       destination      = "aws_cloudwatch_log_group.secure_store.redis"
  #       log_format       = "json"
  #       log_type         = "engine-log"
  #     }
  #   ]

}


output "redis_auth_token" {
  value = random_string.auth_token.result
}
