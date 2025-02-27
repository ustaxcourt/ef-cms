terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.88.0"
      configuration_aliases = [aws.us-west-1]
    }
  }
}
