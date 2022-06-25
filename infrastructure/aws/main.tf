terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
  }
}

provider "docker" {
  registry_auth {
    address  = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.REGION}.amazonaws.com"
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}

provider "aws" {
  region     = var.REGION
  access_key = var.TF_AWS_ACCESS_KEY
  secret_key = var.TF_AWS_SECRET_KEY
  token      = var.TF_AWS_SESSION_TOKEN
}

data "aws_ecr_authorization_token" "token" {}
data "aws_caller_identity" "current" {}

module "db" {
  source             = "../common/db"
  user_table_name    = "users"
  secrets_table_name = "secrets"
}

module "object-storage" {
  source                 = "../common/object_storage"
  public_key_bucket_name = var.PUBLIC_KEY_BUCKET_NAME
}

locals {
  availability_zones = ["${var.REGION}a", "${var.REGION}b", "${var.REGION}c"]
}

module "vpc" {
  source             = "./vpc"
  env                = var.ENV
  availability_zones = local.availability_zones
}



module "api" {
  source = "./api"
  depends_on = [
    module.vpc
  ]
  env             = var.ENV
  vpc_id          = module.vpc.vpc_id
  subnet          = module.vpc.subnet
  region          = var.REGION
  secrets_manager = module.secrets_manager.secrets_repository
  alb_sg_group_id = module.load_balancer.alb_sg_group_id
  providers = {
    docker = docker
  }
}

module "load_balancer" {
  source = "./alb"
  depends_on = [
    module.vpc
  ]
  env             = var.ENV
  vpc_id          = module.vpc.vpc_id
  subnet          = module.vpc.subnet
  ec2_instance_id = module.api.ec2_instance_id
}


module "cache" {
  source        = "./elasticache"
  vpc_id        = module.vpc.vpc_id
  subnet        = module.vpc.subnet
  ec2_sg_id     = module.api.ec2_sg_id
  env           = var.ENV
}

module "secrets_manager" {
  source                = "./secrets"
  oauth_config_url      = var.OAUTH_CONFIG_URL
  google_client_id      = var.GOOGLE_CLIENT_ID
  google_client_secret  = var.GOOGLE_CLIENT_SECRET
  server_salt           = var.SERVER_SALT
  ui_url                = var.UI_URL
  aws_access_key_id     = var.AWS_ACCESS_KEY_ID
  aws_secret_access_key = var.AWS_SECRET_ACCESS_KEY
  region                = var.REGION
  bucket_name           = var.PUBLIC_KEY_BUCKET_NAME
  memory_db_url         = "rediss://default:${module.cache.auth_token}@${module.cache.elasticache_url}:6379"
  env                   = var.ENV
}
