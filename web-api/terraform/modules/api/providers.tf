terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~>6.13.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}
