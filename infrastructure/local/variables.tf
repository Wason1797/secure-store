variable "REGION" {}
variable "PUBLIC_KEY_BUCKET_NAME" {}
variable "ENV" {}
variable "TF_AWS_ACCESS_KEY" { sensitive = true }
variable "TF_AWS_SECRET_KEY" { sensitive = true }
variable "TF_AWS_SESSION_TOKEN" { sensitive = true }
