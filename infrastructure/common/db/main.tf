
resource "aws_dynamodb_table" "dynamodb_users_table" {
  name         = var.user_table_name
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "user_sub"
    type = "S"
  }

  hash_key = "user_sub"
}


resource "aws_dynamodb_table" "dynamodb_secrets_table" {
  name         = var.secrets_table_name
  billing_mode = "PAY_PER_REQUEST"
  attribute {
    name = "secret_id"
    type = "S"
  }

  hash_key = "secret_id"
}
