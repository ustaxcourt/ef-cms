terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.49.0"
      configuration_aliases = [aws.us-west-1]
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}
