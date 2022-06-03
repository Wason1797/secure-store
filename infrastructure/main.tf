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

provider "docker" {}

provider "aws" {
  region     = var.REGION
  access_key = var.ACCESS_KEY
  secret_key = var.SECRET_KEY
}

module "db" {
  source             = "./db"
  USER_TABLE_NAME    = "users"
  SECRETS_TABLE_NAME = "secrets"
}

module "object-storage" {
  source                 = "./object_storage"
  PUBLIC_KEY_BUCKET_NAME = var.PUBLIC_KEY_BUCKET_NAME
}

module "cache" {
  source        = "./cache"
  create_module = (var.ENV == "PROD") ? 1 : 0
}

module "local_cache" {
  source        = "./local_cache"
  create_module = (var.ENV == "DEV") ? 1 : 0
}

