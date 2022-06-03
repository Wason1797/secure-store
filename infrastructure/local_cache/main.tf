terraform {
  required_providers {

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
  }
}



resource "docker_image" "redis" {
  name  = "redis:latest"
  count = var.create_module
}


resource "docker_container" "redis_local" {
  count = var.create_module
  name  = "foo"
  image = docker_image.redis[var.create_module - 1 ].latest
  ports {
    internal = 6379
    external = 6379
  }
}

