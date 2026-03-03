terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "6.33.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}
