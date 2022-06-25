terraform {
  required_providers {

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
  }
}



resource "docker_image" "redis" {
  name = "redis:latest"
}


resource "docker_container" "redis_local" {
  name  = "secure-store-local-redis-cache"
  image = docker_image.redis.latest
  ports {
    internal = 6379
    external = 6379
  }
}

