
resource "aws_dynamodb_table" "dynamodb_users_table" {
  name           = var.user_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = "30"
  write_capacity = "30"

  attribute {
    name = "user_sub"
    type = "S"
  }

  hash_key = "user_sub"
}


resource "aws_dynamodb_table" "dynamodb_secrets_table" {
  name           = var.secrets_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = "30"
  write_capacity = "30"
  attribute {
    name = "secret_id"
    type = "S"
  }

  hash_key = "secret_id"
}
