# Define a KMS key in the primary region (e.g., us-east-1)
resource "aws_kms_key" "primary" {
  description         = "Primary KMS key for Aurora RDS encryption"
  key_usage           = "ENCRYPT_DECRYPT"
  enable_key_rotation = true

  tags = {
    Name = "${var.environment}-primary-kms-key"
  }
}

# Define a KMS key in the replica region (e.g., us-west-1)
resource "aws_kms_key" "replica" {
  provider            = aws.us-west-1
  description         = "Replica KMS key for Aurora RDS encryption"
  key_usage           = "ENCRYPT_DECRYPT"
  enable_key_rotation = true

  tags = {
    Name = "${var.environment}-replica-kms-key"
  }
}
