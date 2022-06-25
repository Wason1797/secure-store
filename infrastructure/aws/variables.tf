variable "REGION" {}
variable "PUBLIC_KEY_BUCKET_NAME" {}
variable "ENV" {}
variable "TF_AWS_ACCESS_KEY" { sensitive = true }
variable "TF_AWS_SECRET_KEY" { sensitive = true }
variable "TF_AWS_SESSION_TOKEN" { sensitive = true }
variable "OAUTH_CONFIG_URL" { sensitive = true }
variable "GOOGLE_CLIENT_ID" { sensitive = true }
variable "GOOGLE_CLIENT_SECRET" { sensitive = true }
variable "SERVER_SALT" { sensitive = true }
variable "UI_URL" { sensitive = true }
variable "AWS_ACCESS_KEY_ID" { sensitive = true }
variable "AWS_SECRET_ACCESS_KEY" { sensitive = true }
