
resource "aws_s3_bucket" "public-key-bucket" {
  bucket = var.PUBLIC_KEY_BUCKET_NAME

  tags = {
    name        = "public key storage"
    environment = "prod"
  }
}

resource "aws_s3_bucket_acl" "public-key-bucket-acl" {
  bucket = aws_s3_bucket.public-key-bucket.id
  acl    = "private"
}
