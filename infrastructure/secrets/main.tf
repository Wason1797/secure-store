
resource "random_string" "session_secret" {
  length  = 64
  special = false
}

resource "random_string" "server_secret" {
  length  = 64
  special = false
}


resource "aws_secretsmanager_secret" "secure_store_secrets" {
  count = var.create_module
  name  = "secure_store_secrets"
}

resource "aws_secretsmanager_secret_version" "sversion" {
  count     = var.create_module
  secret_id = aws_secretsmanager_secret.secure_store_secrets[count.index].id
  secret_string = jsonencode({
    "OAUTH_CONFIG_URL" : "${var.oauth_config_url}",
    "GOOGLE_CLIENT_ID" : "${var.google_client_id}",
    "GOOGLE_CLIENT_SECRET" : "${var.google_client_secret}",
    "SESSION_SECRET" : "${random_string.session_secret.result}",
    "SERVER_SECRET" : "${random_string.server_secret.result}",
    "SERVER_SALT" : "${var.server_salt}",
    "SECURE_STORE_UI_URL" : "${var.ui_url}",
    "AWS_ACCESS_KEY_ID" : "${var.aws_access_key_id}",
    "AWS_SECRET_ACCESS_KEY" : "${var.aws_secret_access_key}",
    "AWS_DYNAMODB_REGION" : "${var.region}",
    "S3_BUCKET_NAME" : "${var.bucket_name}",
    "MEMORY_DB_URL" : "${var.memory_db_url}"
  })
}


output "secrets_repository" {
  value = var.create_module ? aws_secretsmanager_secret.secure_store_secrets : ""
}
