terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }
  }
}

provider "aws" {
  region     = var.REGION
  access_key = var.ACCESS_KEY
  secret_key = var.SECRET_KEY
}

module "db" {
  source = "./db"
  USER_TABLE_NAME = "users"
  SECRETS_TABLE_NAME = "secrets"
}

module "object-storage" {
  source = "./object_storage"
  PUBLIC_KEY_BUCKET_NAME = var.PUBLIC_KEY_BUCKET_NAME
}