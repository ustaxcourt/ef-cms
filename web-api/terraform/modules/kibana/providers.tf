terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
       version = "~> 6.0.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}
