
resource "aws_s3_bucket" "public-key-bucket" {
  bucket = var.public_key_bucket_name

  tags = {
    name        = "public key storage"
    environment = "prod"
  }
}

resource "aws_s3_bucket_acl" "public-key-bucket-acl" {
  bucket = aws_s3_bucket.public-key-bucket.id
  acl    = "private"
}
