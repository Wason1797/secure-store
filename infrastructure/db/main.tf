
resource "aws_dynamodb_table" "dynamodb_users_table" {
  name           = var.USER_TABLE_NAME
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
  name           = var.SECRETS_TABLE_NAME
  billing_mode   = "PROVISIONED"
  read_capacity  = "30"
  write_capacity = "30"
  attribute {
    name = "secret_id"
    type = "S"
  }


  hash_key = "secret_id"
}
