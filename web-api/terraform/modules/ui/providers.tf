terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 6.2.0"
      configuration_aliases = [aws.us-west-1]
    }
  }
}
