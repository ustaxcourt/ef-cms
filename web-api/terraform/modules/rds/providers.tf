terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "6.66.0"
      configuration_aliases = [aws.us-west-1]
    }
  }
}
