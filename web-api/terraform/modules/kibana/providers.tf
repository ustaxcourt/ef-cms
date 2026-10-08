terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.68.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.6.0"
    }
  }
}
