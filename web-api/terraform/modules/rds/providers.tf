terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "6.44.0"
      configuration_aliases = [aws.us-west-1]
    }
  }
}
