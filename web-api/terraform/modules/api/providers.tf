terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "6.50.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}
