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

provider "aws" {
  region     = var.REGION
  access_key = var.TF_AWS_ACCESS_KEY
  secret_key = var.TF_AWS_SECRET_KEY
  token      = var.TF_AWS_SESSION_TOKEN
}

module "db" {
  source             = "../common/db"
  user_table_name    = "users"
  secrets_table_name = "secrets"
}

module "object-storage" {
  source                 = "../common/object_storage"
  public_key_bucket_name = var.PUBLIC_KEY_BUCKET_NAME
}



module "cache" {
  source = "./cache"
}


