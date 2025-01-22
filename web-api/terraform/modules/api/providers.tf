terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.78.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}
