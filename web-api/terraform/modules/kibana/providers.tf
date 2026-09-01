terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.61.0"
    }
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.5.0"
    }
  }
}
