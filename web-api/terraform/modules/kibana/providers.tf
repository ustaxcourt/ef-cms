terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.99.1"
      configuration_aliases = [aws.us-west-1]
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}
